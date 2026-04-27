---
title: Sentry architecture
description: "Production P2P topology for Safrochain validators: sentry nodes, persistent peers, private validator network."
sidebar_position: 5
keywords:
  - sentry node
  - validator topology
  - P2P network
  - persistent peers
  - private peers
  - addr_book
  - DDoS mitigation
  - Cosmos sentry pattern
---

The **sentry pattern** is the canonical way to expose a Cosmos validator
to the network without exposing the validator host itself. Sentries take
the public traffic; the validator stays in a private subnet where only
the sentries (and the remote signer) can reach it.

## Reference topology

```text
                              ┌────────────────────┐
                              │    Public seeds    │  (foundation-run)
                              │  + remote peers    │
                              └────────┬───────────┘
                                       │ P2P
                ┌──────────────────────┴──────────────────────┐
                │                                             │
        ┌───────▼────────┐                          ┌─────────▼──────┐
        │   sentry-1     │                          │   sentry-2     │
        │  (region A)    │                          │  (region B)    │
        │  public IP     │                          │  public IP     │
        └───────┬────────┘                          └─────────┬──────┘
                │  P2P (private VPC)                          │
                └────────────────────┬────────────────────────┘
                                     ▼
                            ┌────────────────┐
                            │   validator    │   ← no public IP
                            │  private VPC   │      no inbound from internet
                            └────────────────┘
```

Two sentries in **two different regions / providers** is the minimum that
gives you fault-tolerance. Three is better. The validator itself sits on
a private subnet and only accepts P2P connections from the sentries.

## What each role does

| Role | Public IP? | Accepts inbound P2P? | Has consensus key? |
| --- | --- | --- | --- |
| **Validator** | no | only from sentries (private addr_book) | yes (or talks to remote signer) |
| **Sentry** | yes | from anyone | **no** (regular full nodes) |
| **RPC node** (optional) | yes | yes (often P2P + RPC + REST) | no |

The validator and sentries run **the same `safrochaind` binary**; only
their `config.toml` and firewall posture differ.

## Validator `config.toml`

```toml
[p2p]
laddr = "tcp://0.0.0.0:26656"
external_address = ""              # never expose
pex = false                        # do not gossip our address book
addr_book_strict = false
private_peer_ids = "<sentry1_node_id>,<sentry2_node_id>"
unconditional_peer_ids = "<sentry1_node_id>,<sentry2_node_id>"
persistent_peers = "<sentry1_node_id>@10.0.0.21:26656,<sentry2_node_id>@10.0.0.22:26656"
seeds = ""                         # validator NEVER talks to seeds directly
allow_duplicate_ip = true          # tolerate sentries sharing IPs in your VPC
max_num_inbound_peers = 4
max_num_outbound_peers = 0         # only dial sentries
```

Key flags:

- `private_peer_ids`: these peers' presence is **never gossiped**. Stops
  random nodes from learning about your validator.
- `unconditional_peer_ids`: bypass the inbound peer cap; the validator
  will always accept these specific node IDs even when the inbound table
  is full.
- `pex = false` and `seeds = ""`: keep the validator off the gossip
  network entirely.

## Sentry `config.toml`

```toml
[p2p]
laddr = "tcp://0.0.0.0:26656"
external_address = "tcp://<sentry_public_ip>:26656"
pex = true                          # gossip normally
seeds = "<foundation_seed_id>@seed.safrochain.network:26666"
persistent_peers = "<validator_node_id>@10.0.0.10:26656"
unconditional_peer_ids = "<validator_node_id>"
private_peer_ids = ""               # nothing to hide on a sentry
max_num_inbound_peers = 80
max_num_outbound_peers = 20
```

The sentry **always** keeps a connection open to the validator
(`unconditional_peer_ids`) so the validator's view of the chain is never
starved during a P2P storm.

## Firewall rules (validator)

Inbound, on the validator:

| From | Port | Why |
| --- | --- | --- |
| sentry-1 IP | 26656/TCP | P2P |
| sentry-2 IP | 26656/TCP | P2P |
| signer subnet | 26659/TCP (TMKMS) or 23756 (Horcrux) | privval |
| ops bastion | 22/TCP | SSH (preferably WireGuard, not 0.0.0.0/0) |
| Prometheus host | 26660/TCP, 9100/TCP | metrics scrape |

Drop everything else. **No 1317, no 9090, no 26657 on the validator.** If
you need to query the chain from your laptop, query a sentry or RPC node.

## Firewall rules (sentry)

| From | Port | Why |
| --- | --- | --- |
| anywhere (`0.0.0.0/0`) | 26656/TCP | public P2P |
| ops bastion | 22/TCP | SSH |
| Prometheus host | 26660/TCP, 9100/TCP | metrics scrape |
| (optional) `0.0.0.0/0` | 26657/TCP, 1317/TCP, 9090/TCP | only if this sentry is also a public RPC |

## Discover node IDs

On any node:

```bash
safrochaind comet show-node-id
# 1234567890abcdef… (40-hex-char node ID)
```

Combine with the IP/port to form a peer string:

```text
1234567890abcdef…1234567890abcdef…1234567890ab@10.0.0.21:26656
```

## How to verify the topology is correct

Run from the validator:

```bash
curl -s http://localhost:26657/net_info \
  | jq '.result.peers[] | {id: .node_info.id, ip: .remote_ip}'
```

You should see **only** sentry node IDs in this list. If you see anything
else, your firewall is leaking.

Run from each sentry:

```bash
curl -s http://localhost:26657/net_info \
  | jq '.result | {n_peers, peers: [.peers[].node_info.id]}'
```

The sentry should show one connection to the validator plus 10–80 public
peers from the gossip network.

## Operational notes

- **Sentry rotation.** Treat sentries as cattle. Rebuild a sentry by
  running `safrochaind` on a fresh box, copying the `node_key.json` (or
  generating a new one) and adding its node ID to the validator's
  `persistent_peers`. Roll one at a time so the validator always has at
  least one healthy uplink.
- **Geo-diversity.** Two sentries in the same datacenter are one
  electrical fault. Spread across at least two cloud regions or providers.
- **Don't share node identity.** Each node's `node_key.json` should be
  unique. Sharing `node_key.json` between sentries causes peer churn at
  the gossip layer.
- **Public RPC ≠ sentry.** A sentry that also exposes RPC on
  `0.0.0.0:26657` is fine, but make sure the unsafe RPC routes
  (`broadcast_tx_*`, `unsafe_*`, `dial_seeds`) are blocked at the
  reverse proxy. Never expose them from the validator host.
