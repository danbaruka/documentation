---
title: Join mainnet
description: Sync a Safrochain node against safrochain-1 (Q3 2026).
sidebar_position: 6
---

:::info Mainnet target: Q3 2026
Mainnet is **not** producing blocks yet. The flow below is the procedure
the foundation will publish on launch day. Endpoints, seed node IDs, and
genesis SHA-256 are placeholders until the chain is live.
:::

## Network versions

| Network | Chain ID | safrochain-node tag | Go |
| --- | --- | --- | --- |
| Mainnet | `safrochain-1` | `v0.2.0` | `1.25.8` |
| Testnet | `safro-testnet-1` | `v0.1.0` | `1.25.8` |

## Endpoints

See [Networks → Mainnet endpoints](../networks/mainnet-endpoints). Quick
reference:

| Service | Endpoint |
| --- | --- |
| RPC | [https://rpc.safrochain.network](https://rpc.safrochain.network) (round-robin between rpc1/rpc2) |
| REST | [https://api.safrochain.network](https://api.safrochain.network) |
| gRPC | [https://grpc.safrochain.network](https://grpc.safrochain.network) |
| gRPC-Web | [https://grpc-web.safrochain.network](https://grpc-web.safrochain.network) |
| Seeds | `seed.safrochain.network:26666`, `seed2.safrochain.network:26670` |
| Status | [https://status.safrochain.network](https://status.safrochain.network) |

## Steps

### 1. Install `safrochaind`

```bash
git clone https://github.com/Safrochain-Org/safrochain-node
cd safrochain-node
git checkout v0.2.0
make install
safrochaind version
```

### 2. Initialise the home

```bash
safrochaind init my-moniker --chain-id safrochain-1 --home ~/.safrochain
```

### 3. Replace genesis

```bash
curl -L https://raw.githubusercontent.com/Safrochain-Org/safrochain-node/main/networks/safrochain-1/genesis.json \
  -o ~/.safrochain/config/genesis.json

sha256sum ~/.safrochain/config/genesis.json
# expected: <HASH-PUBLISHED-ON-LAUNCH-DAY>
```

Source of truth at launch:

- The GitHub **release** for tag `v0.2.0` will publish:
  - `genesis.json`
  - `genesis.json.sha256`

Verify using the published checksum:

```bash
curl -fsSL https://github.com/Safrochain-Org/safrochain-node/releases/download/v0.2.0/genesis.json \
  -o ~/.safrochain/config/genesis.json
curl -fsSL https://github.com/Safrochain-Org/safrochain-node/releases/download/v0.2.0/genesis.json.sha256 \
  -o /tmp/genesis.json.sha256
( cd ~/.safrochain/config && shasum -a 256 -c /tmp/genesis.json.sha256 )
```

### 4. Configure peers

Edit `~/.safrochain/config/config.toml`:

```toml
[p2p]
seeds = "<NODEID1>@seed.safrochain.network:26666,<NODEID2>@seed2.safrochain.network:26670"
persistent_peers = ""
addr_book_strict = true
pex = true
```

The seed node IDs are published in:

- [Chain registry](../networks/chain-registry) (field `peers.seeds[].id`)
- the `v0.2.0` GitHub release notes

At launch, you will replace `<NODEID1>` and `<NODEID2>` with 40-hex-char node IDs:

```text
<node_id_1>@seed.safrochain.network:26666,<node_id_2>@seed2.safrochain.network:26670
```

### 5. App-level settings (`app.toml`)

```toml
# config/app.toml

minimum-gas-prices = "0.025usaf"

[api]
enable = true
swagger = false
address = "tcp://0.0.0.0:1317"

[grpc]
enable = true
address = "0.0.0.0:9090"

[grpc-web]
enable = true
address = "0.0.0.0:9091"

[telemetry]
enabled = true
prometheus-retention-time = 60

# pruning
pruning             = "default"
pruning-keep-recent = "100"
pruning-interval    = "10"
```

For an archive (RPC-2-style) node:

```toml
pruning = "nothing"
```

### 6. Set CLI defaults

```bash
safrochaind config chain-id  safrochain-1
safrochaind config node      https://rpc.safrochain.network:443
safrochaind config keyring-backend file
safrochaind config broadcast-mode sync
safrochaind config output  json
```

### 7. (Recommended) Statesync from rpc1/rpc2

Mainnet history won't be huge for the first few months, but statesync
saves time even at low height. See [Statesync](./statesync).

### 8. Start under systemd

```ini
# /etc/systemd/system/safrochaind.service
[Unit]
Description=Safrochain mainnet node
After=network-online.target

[Service]
Type=simple
User=safrochain
ExecStart=/home/safrochain/go/bin/safrochaind start --home /var/lib/safrochain
Restart=on-failure
RestartSec=5s
LimitNOFILE=1048576
TimeoutStopSec=30s

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now safrochaind
sudo journalctl -u safrochaind -f
```

### 9. Verify

```bash
curl -s http://127.0.0.1:26657/status \
  | jq '.result.sync_info | {latest_block_height, catching_up}'

# match against a public RPC
curl -s https://rpc.safrochain.network/status \
  | jq '.result.sync_info.latest_block_height'
```

The two values should converge once you finish catching up.

## Recommended posture

- **Pruned RPC**: `default` pruning, fronted by a TLS-terminating reverse
  proxy on `:443` if you intend to expose it publicly.
- **Archive RPC**: `nothing` pruning, behind a private network, used as a
  source of truth for explorers / indexers.
- **Validator**: `default` pruning, **no public exposure**, P2P only to
  your own sentries / private network.

## After your first upgrade

Use **cosmovisor** so your binary swaps automatically at the upgrade
height. See [Upgrades](./upgrades).
