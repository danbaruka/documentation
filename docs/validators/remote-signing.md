---
title: Remote signing (TMKMS & Horcrux)
description: Move the Safrochain consensus key off the validator host with TMKMS or Horcrux threshold signing.
sidebar_position: 4
keywords:
  - remote signing
  - TMKMS
  - Horcrux
  - threshold signing
  - cosmos consensus key
  - YubiHSM
  - validator security
  - HSM
  - priv_validator_key.json
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The default `priv_validator_key.json` on the validator host is convenient
but it is the single most attractive target for an attacker. Production
validators move signing **off the validator** to a dedicated process:
either a single-instance signer with an HSM (TMKMS) or a threshold-MPC
cluster (Horcrux).

## Why move signing off the host

| Risk on the validator host | Mitigation by remote signing |
| --- | --- |
| Disk image stolen → key extracted | Key never written to validator disk |
| Process compromised → memory dump | Signing happens on a different host |
| Migration accidentally runs two nodes with the same key | Threshold signer can only sign once per height |
| HSM is on the wrong host | Dedicated signer host can be air-gapped from the public internet |

## Choose your signer

| Project | Topology | When to pick it |
| --- | --- | --- |
| **TMKMS** (`iqlusioninc/tmkms`) | one signer + softsign / YubiHSM | small operators; one host with an HSM |
| **Horcrux v3** (`strangelove-ventures/horcrux`) | 2-of-3 or 3-of-5 cosigners | mid- to large-stake validators; geographic redundancy |
| Tendermint privval gRPC | DIY | only if you already operate a custom signer |

For Safrochain mainnet, the foundation recommends **Horcrux 2-of-3** for
any validator above 100k SAF self-stake. Below that, TMKMS with a YubiHSM
or `softsign` on a hardened host is acceptable.

## Topology

```text
                ┌────────────┐    ┌────────────┐
                │  sentry-1  │    │  sentry-2  │
                │  (public)  │    │  (public)  │
                └─────┬──────┘    └─────┬──────┘
                      │  P2P (26656)    │
                      └──────┬──────────┘
                             ▼
                    ┌─────────────────┐
                    │   validator     │   ← no priv_validator_key.json
                    │  (private VPC)  │
                    └────────┬────────┘
                             │  privval (port 26659, mTLS)
                             ▼
            ┌────────────┬────────────┬────────────┐
            │ cosigner-1 │ cosigner-2 │ cosigner-3 │   (Horcrux only)
            │   (DC-A)   │   (DC-B)   │   (DC-C)   │
            └────────────┴────────────┴────────────┘
```

The validator binds its `privval_laddr` to a private network address that
**only the signer cluster** can reach. Public sentries fan out the P2P
gossip; the validator itself never has a public IP.

## Signer 1 · TMKMS (single-instance)

### Install

```bash
git clone https://github.com/iqlusioninc/tmkms.git
cd tmkms
cargo install --path . --features=softsign,yubihsm
```

(For Linux without Rust: `cargo install tmkms --features=softsign`.)

### Convert your existing consensus key

If you already initialised the validator with a local key, import it once:

```bash
tmkms softsign import \
  ~/.safrochain/config/priv_validator_key.json \
  /etc/tmkms/safro_consensus.key

# Then SHRED the original on the validator host:
shred -u ~/.safrochain/config/priv_validator_key.json
```

### `tmkms.toml`

```toml
[[chain]]
id = "safro-mainnet-1"
key_format = { type = "bech32", account_key_prefix = "addr_safropub", consensus_key_prefix = "addr_safrovalconspub" }
state_file = "/etc/tmkms/safro_state.json"

[[providers.softsign]]
chain_ids = ["safro-mainnet-1"]
key_type = "consensus"
path = "/etc/tmkms/safro_consensus.key"

[[validator]]
chain_id = "safro-mainnet-1"
addr = "tcp://10.0.0.10:26659"   # validator's privval_laddr
secret_key = "/etc/tmkms/cosmos-validator-tmkms.id"
protocol_version = "v0.34"
reconnect = true
```

> Replace `softsign` with `yubihsm` and add a `[[providers.yubihsm]]` block
> if you are using a YubiHSM 2: the key never leaves the device.

### Run it

```bash
tmkms start -c /etc/tmkms/tmkms.toml
```

### Point the validator at TMKMS

In `~/.safrochain/config/config.toml` on the validator:

```toml
priv_validator_laddr = "tcp://10.0.0.10:26659"
priv_validator_key_file  = ""
priv_validator_state_file = ""
```

The empty `priv_validator_*` paths are intentional: when `priv_validator_laddr`
is set, CometBFT refuses to fall back to a local key.

## Signer 2 · Horcrux (threshold MPC)

Horcrux replaces the single `priv_validator_key.json` with **N shares**
distributed across cosigners; any `M` of `N` shares can sign. **No single
host ever holds the full key.** A 2-of-3 cluster tolerates one cosigner
outage and one cosigner compromise.

### Install on every cosigner

```bash
git clone https://github.com/strangelove-ventures/horcrux.git
cd horcrux && make install   # produces ./horcrux
```

### One-time: split the consensus key into 3 shares

On a **clean, offline machine**:

```bash
horcrux create-shares \
  ~/.safrochain/config/priv_validator_key.json \
  3 \
  --threshold 2 \
  --out-dir ./shares
# produces shares/cosigner_1/priv_validator_key.json, …
```

Shred the original on the validator host:

```bash
shred -u ~/.safrochain/config/priv_validator_key.json
```

Distribute one share to each cosigner over an out-of-band channel
(GPG-encrypted, carried on a USB drive, etc.). **Never email the shares
in plaintext.**

### `config.yaml` on each cosigner

```yaml
chain-nodes:
  - priv-val-addr: tcp://10.0.0.10:23756   # this cosigner's exposed addr

cosigner:
  threshold: 2
  shares: 3
  p2p-listen: tcp://0.0.0.0:23756
  peers:
    - shard-id: 1
      p2p-addr: tcp://10.0.1.11:23756
    - shard-id: 2
      p2p-addr: tcp://10.0.2.11:23756
    - shard-id: 3
      p2p-addr: tcp://10.0.3.11:23756

  raft-timeout: 1000ms
  grpc-timeout: 1000ms
```

### Run on each cosigner

```bash
horcrux start --config /etc/horcrux/config.yaml
```

### Point the validator at the cluster

```toml
# config.toml on the validator
priv_validator_laddr = "tcp://0.0.0.0:23756"
priv_validator_key_file  = ""
priv_validator_state_file = ""
```

Horcrux cosigners dial the validator on `priv_validator_laddr` and
collectively answer signing requests. The validator never knows or cares
which cosigners are online: it just gets a signed vote.

## Smoke-test the signer

After starting TMKMS or Horcrux, watch the validator logs:

```bash
journalctl -u safrochaind -f | grep -Ei 'signed|privval'
```

You should see `signed proposal` and `signed vote` lines at every height.
If you see `failed to start private validator socket client`, the signer
is unreachable: check firewall rules and `priv_validator_laddr`.

Compare the consensus address that the signer is producing with the one
your validator was created with:

```bash
# from the signer's logs at startup
# Cosmos consensus pubkey: addr_safrovalconspub1...

# from the chain
safrochaind query staking validator $(safrochaind keys show validator --bech val -a) \
  --node https://rpc.safrochain.network:443 -o json \
  | jq '.consensus_pubkey'
```

If the two **do not match**, you imported the wrong key: stop everything
and reconfigure before signing a single block.

## Going from local to remote: zero-downtime checklist

1. Spin up the signer (TMKMS or Horcrux) and confirm it boots cleanly.
2. **Stop the validator** (`systemctl stop safrochaind`).
3. Verify with `safrochaind status` on a peer that you have stopped
   producing signatures.
4. Edit `config.toml` to set `priv_validator_laddr` and clear the file
   paths.
5. Shred `priv_validator_key.json` on the validator host.
6. Start the validator (`systemctl start safrochaind`).
7. Confirm signing resumes within `signed_blocks_window / 2` blocks.
8. Update [Disaster recovery](./disaster-recovery) runbook to reflect the
   new key location.

> Read [Slashing & jail](./slashing) before you make any signer change in
> production. The unbonding period is non-trivial.
