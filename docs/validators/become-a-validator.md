---
title: How to become a Safrochain validator
description: "Step-by-step guide to creating, funding, and running a Safrochain validator on CometBFT proof-of-stake: keys, self-delegation, commission, and signing."
sidebar_position: 1
keywords:
  - Safrochain validator
  - become a validator
  - CometBFT
  - proof of stake
  - self-delegation
  - validator commission
  - staking
  - SAF
  - create-validator
  - tendermint validator
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Safrochain runs **CometBFT proof-of-stake** consensus. Validators stake `SAF`,
sign blocks, and earn block rewards plus commission from delegations. This
guide walks you through the entire lifecycle: prerequisites → key generation
→ `create-validator` → post-launch checks → going live.

## 1 · Prerequisites

| Requirement | Value |
| --- | --- |
| `safrochaind` installed | follow [Install safrochaind](../run-a-node/install) |
| Synced full node | sync to chain tip and confirm `catching_up = false` |
| Self-delegation | minimum **1,000,000 `usaf`** = 1 SAF (recommended much higher) |
| Available SAF for fees | a few `usaf` for gas |
| Operator key | secp256k1, 24-word mnemonic stored offline |
| Hardware | see [Hardware requirements](../run-a-node/hardware) |
| Time sync | `chrony`/`ntp` (Linux) or built-in NTP (macOS); offset < 250 ms |

Verify your node is fully synced before continuing:

```bash
safrochaind status \
  | jq '.sync_info | {latest_block_height, latest_block_time, catching_up}'
```

If `catching_up` is `true`, wait for it to flip to `false`.

### Install time-sync (one-time setup)

<Tabs groupId="os" defaultValue="ubuntu">
  <TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo apt install -y chrony
sudo systemctl enable --now chrony
chronyc tracking | grep 'System time'
```

  </TabItem>
  <TabItem value="rhel" label="Fedora / RHEL">

```bash
sudo dnf install -y chrony
sudo systemctl enable --now chronyd
chronyc tracking | grep 'System time'
```

  </TabItem>
  <TabItem value="macos" label="macOS">

```bash
sudo systemsetup -setusingnetworktime on
sudo sntp -sS time.apple.com
```

  </TabItem>
</Tabs>

## 2 · Generate (or import) your operator key

```bash
safrochaind keys add validator --keyring-backend file

safrochaind keys add validator --recover --keyring-backend file

safrochaind keys show validator -a --keyring-backend file
```

> Important: copy and store the 24-word mnemonic offline; it is the
> **only** recovery path for this key.

Recommended keyring backends, in order: `file` (passphrase-protected) >
`os` > `test` (only for a local development node). Never commit the
keyring to a public machine or repository.

## 3 · Fund the operator address

- **Mainnet:** acquire SAF for self-delegation through the foundation
  validator programme or a partner exchange.
- **Testnet:** request from `https://faucet.safrochain.com/` (chain id
  `safro-testnet-1`).

Verify the balance:

```bash
safrochaind query bank balances "$(safrochaind keys show validator -a)"
```

## 4 · Get your consensus pubkey

Each validator process generates `priv_validator_key.json` on first init.
Read its **consensus public key** with:

```bash
PUBKEY=$(safrochaind comet show-validator)
echo "$PUBKEY"
# {"@type":"/cosmos.crypto.ed25519.PubKey","key":"…"}
```

This is the value you pass to `--pubkey` below.

## 5 · Build the `validator.json` payload

```bash
cat > validator.json <<EOF
{
  "pubkey": $PUBKEY,
  "amount": "10000000usaf",
  "moniker": "my-safro-validator",
  "identity": "",
  "website": "https://example.com",
  "security": "security@example.com",
  "details": "Run by Example Co.",
  "commission-rate": "0.05",
  "commission-max-rate": "0.20",
  "commission-max-change-rate": "0.01",
  "min-self-delegation": "1"
}
EOF
```

**Field-by-field:**

| Field | Meaning |
| --- | --- |
| `pubkey` | the consensus pubkey from `safrochaind comet show-validator` |
| `amount` | initial self-delegation (in `usaf`); `10000000usaf` = 10 SAF |
| `moniker` | display name in explorers |
| `identity` | Keybase 16-char fingerprint (optional, used for avatars) |
| `website` / `security` / `details` | description shown on validator page |
| `commission-rate` | % of rewards you take (`0.05` = 5 %) |
| `commission-max-rate` | hard ceiling, cannot be raised later |
| `commission-max-change-rate` | maximum daily commission delta |
| `min-self-delegation` | bonded floor; if self-delegation drops below this, you are unbonded |

## 6 · Submit `tx staking create-validator`

<Tabs groupId="network" defaultValue="testnet">
  <TabItem value="testnet" label="Testnet (live)">

```bash
safrochaind tx staking create-validator validator.json \
  --from validator \
  --chain-id safro-testnet-1 \
  --gas auto --gas-adjustment 1.3 \
  --fees 5000usaf \
  --keyring-backend file \
  --node https://rpc.testnet.safrochain.com:443 \
  --yes
```

  </TabItem>
  <TabItem value="mainnet" label="Mainnet (Q3 2026)">

```bash
safrochaind tx staking create-validator validator.json \
  --from validator \
  --chain-id safro-mainnet-1 \
  --gas auto --gas-adjustment 1.3 \
  --fees 5000usaf \
  --keyring-backend file \
  --node https://rpc.safrochain.network:443 \
  --yes
```

  </TabItem>
</Tabs>

## 7 · Verify the validator was created

<Tabs groupId="network" defaultValue="testnet">
  <TabItem value="testnet" label="Testnet">

```bash
VALADDR=$(safrochaind keys show validator --bech val -a)
safrochaind query staking validator "$VALADDR" \
  --node https://rpc.testnet.safrochain.com:443
```

  </TabItem>
  <TabItem value="mainnet" label="Mainnet">

```bash
VALADDR=$(safrochaind keys show validator --bech val -a)
safrochaind query staking validator "$VALADDR" \
  --node https://rpc.safrochain.network:443
```

  </TabItem>
</Tabs>

You should see your moniker, `tokens` (initial self-delegation), and
`status: BOND_STATUS_BONDED`.

## 8 · Confirm signing

Watch the validator power and your `last_signed_height` rise:

```bash
VALCONSADDR=$(safrochaind comet show-address)

curl -s https://rpc.safrochain.network/validators \
  | jq --arg a "$VALCONSADDR" '.result.validators[] | select(.address==$a)'

journalctl -u safrochaind -f | grep -i 'signed.*vote'
```

## 9 · Set up monitoring before going live

CometBFT exposes Prometheus metrics on `:26660` when `prometheus = true` in
`config.toml`. At minimum, scrape and alert on:

- `cometbft_consensus_validator_missed_blocks` (downtime → jail)
- `cometbft_consensus_height` (must keep increasing on every node)
- node CPU / disk pressure on the validator host
- NTP/chrony time drift (signing with a clock skew > a few seconds is risky)

Wire these into your existing observability stack (Prometheus + Grafana,
Datadog, Grafana Cloud, Better Uptime, etc.) and hook a paging channel
(Discord, PagerDuty, OpsGenie) to the **critical** alerts.

## 10 · (Recommended) Move signing off the validator host

The local `priv_validator_key.json` is convenient but creates a single
point of failure. Once your validator is stable, move signing to a remote
signer such as **CometBFT remote signer** or **Horcrux 2-of-3** (threshold
MPC) so that no single host holds a usable key. Both projects ship
production-ready Docker images and detailed migration guides.

## Day-2 reference

| Action | Command |
| --- | --- |
| Edit description / commission | `safrochaind tx staking edit-validator --commission-rate 0.06 …` |
| Self-delegate more | `safrochaind tx staking delegate $VALADDR 5000000usaf …` |
| Unjail after downtime | `safrochaind tx slashing unjail --from validator …` |
| Unbond (begin exit) | `safrochaind tx staking unbond $VALADDR <amount>usaf …` |

Read [Slashing & jail](./slashing) before going further. The unbonding
period is non-trivial and downtime has on-chain consequences.
