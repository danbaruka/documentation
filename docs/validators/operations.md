---
title: Validator operations (day-2)
description: Edit commission, withdraw rewards, software upgrades, state pruning, and the routine work of running a Safrochain validator.
sidebar_position: 8
keywords:
  - validator operations
  - edit-validator
  - withdraw rewards
  - software upgrade
  - cosmovisor
  - state pruning
  - re-delegate
  - unbond
  - commission rate
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This page is the operator's day-to-day cheat sheet: the commands you
will run weekly or monthly once the validator is live. Everything
assumes:

- You have your operator key in `validator` (keyring backend `file`).
- `--node` points at a healthy RPC (use a foundation endpoint or one of
  your own sentries).
- You are on **mainnet**; for testnet replace the chain id and RPC.

```bash
export VALADDR=$(safrochaind keys show validator --bech val -a --keyring-backend file)
export CHAIN_ID=safrochain-1
export NODE=https://rpc.safrochain.network:443
export FEES="--gas auto --gas-adjustment 1.3 --gas-prices 0.05usaf"
```

## Edit description / commission

```bash
safrochaind tx staking edit-validator \
  --moniker "my-safro-validator" \
  --website "https://example.com" \
  --identity "1234567890ABCDEF" \
  --details "Run by Example Co.: Africa-first" \
  --security-contact "security@example.com" \
  --commission-rate "0.05" \
  --from validator --keyring-backend file \
  --chain-id $CHAIN_ID --node $NODE $FEES --yes
```

> **Commission constraints:**
> - You can lower it any time.
> - You can raise it once per `commission-max-change-rate` window
>   (typically 24 h) and never above `commission-max-rate`.
> - `commission-max-rate` and `commission-max-change-rate` are **fixed
>   at create-time** and cannot be raised later.

## Self-delegate more

```bash
safrochaind tx staking delegate $VALADDR 50000000usaf \
  --from validator --keyring-backend file \
  --chain-id $CHAIN_ID --node $NODE $FEES --yes
```

(`50000000usaf` = 50 SAF.)

## Withdraw rewards

Rewards (commission + delegations) accrue automatically; you must
**withdraw** them.

```bash
safrochaind tx distribution withdraw-rewards $VALADDR \
  --commission \
  --from validator --keyring-backend file \
  --chain-id $CHAIN_ID --node $NODE $FEES --yes
```

`--commission` also pulls the commission share. Without that flag you
only pull rewards on your **self-delegation**.

Inspect what is pending first:

```bash
safrochaind query distribution rewards \
  $(safrochaind keys show validator -a) $VALADDR --node $NODE
```

## Re-delegate (move stake to another validator)

```bash
safrochaind tx staking redelegate $VALADDR \
  addr_safrovaloper1otherValidatorAddressHere \
  10000000usaf \
  --from validator --keyring-backend file \
  --chain-id $CHAIN_ID --node $NODE $FEES --yes
```

A redelegation completes immediately but **re-redelegating the same
stake** is rate-limited (one redelegation per validator pair per
unbonding period).

## Begin unbonding (graceful exit)

```bash
safrochaind tx staking unbond $VALADDR 100000000usaf \
  --from validator --keyring-backend file \
  --chain-id $CHAIN_ID --node $NODE $FEES --yes
```

The unbonded amount enters the unbonding queue and can still be **slashed
for offences committed before the unbond began**. Until the unbonding
period ends, the validator must keep signing.

## Unjail after downtime

If the chain jails you for missing too many blocks, fix the cause **then**
unjail:

```bash
safrochaind tx slashing unjail \
  --from validator --keyring-backend file \
  --chain-id $CHAIN_ID --node $NODE $FEES --yes
```

A `validator still jailed` error means you are unjailing too early:
wait one more `signed_blocks_window` and retry. See [Slashing & jail](./slashing).

## Software upgrades

Cosmos chains coordinate software upgrades through the `x/upgrade`
module. Validators must run the new binary at exactly the upgrade height
or the chain will halt.

The recommended pattern is **Cosmovisor**, which swaps binaries
automatically on the upgrade height.

### Install Cosmovisor

```bash
go install cosmossdk.io/tools/cosmovisor/cmd/cosmovisor@latest

# Cosmovisor expects this layout:
# $DAEMON_HOME/cosmovisor/
#     genesis/bin/safrochaind             # current binary
#     upgrades/<upgrade-name>/bin/safrochaind   # new binary, pre-staged
```

`/etc/systemd/system/safrochaind.service`:

```ini
[Unit]
Description=Safrochain via Cosmovisor
After=network-online.target

[Service]
User=safro
Environment=DAEMON_HOME=/home/safro/.safrochain
Environment=DAEMON_NAME=safrochaind
Environment=DAEMON_RESTART_AFTER_UPGRADE=true
Environment=DAEMON_ALLOW_DOWNLOAD_BINARIES=false
ExecStart=/home/safro/go/bin/cosmovisor run start
Restart=always
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
```

> Set `DAEMON_ALLOW_DOWNLOAD_BINARIES=false` on the validator. Always
> pre-stage the upgrade binary yourself; never let the validator pull
> code from the internet.

### Pre-stage the new binary

Hours (not minutes) before the upgrade height:

```bash
mkdir -p $HOME/.safrochain/cosmovisor/upgrades/v0.3.0/bin
# build or copy the v0.3.0 binary into:
cp ./safrochaind $HOME/.safrochain/cosmovisor/upgrades/v0.3.0/bin/safrochaind
chmod +x $HOME/.safrochain/cosmovisor/upgrades/v0.3.0/bin/safrochaind

# verify the version *the cosmovisor will run* matches the announcement
$HOME/.safrochain/cosmovisor/upgrades/v0.3.0/bin/safrochaind version
```

### What happens at the upgrade height

1. The chain pauses one block before the upgrade height.
2. Cosmovisor swaps `genesis/bin/safrochaind` → `upgrades/v0.3.0/bin/safrochaind`.
3. `safrochaind` restarts and applies the migration handler.
4. The chain resumes at the upgrade height.

If your binary is missing, your node halts and you start missing blocks.
If 1/3+ of voting power misses the upgrade, the chain itself halts.

## Manual upgrade (without Cosmovisor)

If you do not run Cosmovisor:

1. Watch the chain. When it logs
   `UPGRADE "v0.3.0" NEEDED at height: X`, the next block will halt.
2. Stop the validator: `sudo systemctl stop safrochaind`.
3. Replace the binary: `cp ./safrochaind /usr/local/bin/safrochaind`.
4. Start the validator: `sudo systemctl start safrochaind`.

Done correctly, this loses 1–2 blocks. Done in panic at 03:00 UTC, this
loses your validator.

## State pruning

Disk grows fast on a synced node. Configure pruning in
`~/.safrochain/config/app.toml`:

```toml
pruning = "custom"
pruning-keep-recent = "100"
pruning-interval = "10"
min-retain-blocks = 100
```

| Mode | What it keeps | Use case |
| --- | --- | --- |
| `default` | last 362 880 + every 100 | regular full node |
| `nothing` | only the last block | archive node: no |
| `everything` | every block forever | archive node: yes |
| `custom` | as configured | validator (recommended) |

Validators rarely need to query history; aggressive pruning saves disk
and IOPS. Pair it with:

```toml
[state-sync]
snapshot-interval = 1000
snapshot-keep-recent = 2
```

So you (or others) can fast-sync new sentries from your snapshots.

## Routine maintenance schedule

| Cadence | Task |
| --- | --- |
| Daily | review Grafana, confirm voting power, check Discord/Telegram alerts inbox |
| Weekly | withdraw commission, check disk free, review missed-block heatmap |
| Monthly | rotate logs, patch OS (`unattended-upgrades`), audit firewall rules |
| Quarterly | run a paging-test alert, restore-from-backup drill, key-rotation review |
| On governance proposal | read it, vote: `safrochaind tx gov vote <id> yes …` |

## Voting on governance

Validators are expected to vote on every governance proposal: your
delegators delegated to **your judgement** as well as your uptime.

```bash
safrochaind query gov proposals --status voting_period --node $NODE

safrochaind tx gov vote <PROPOSAL_ID> yes \
  --from validator --keyring-backend file \
  --chain-id $CHAIN_ID --node $NODE $FEES --yes
```

Vote options: `yes` · `no` · `no_with_veto` · `abstain`.

## Quick reference card

| Action | Command |
| --- | --- |
| Show me my validator | `safrochaind query staking validator $VALADDR` |
| Am I jailed? | `safrochaind query staking validator $VALADDR -o json \| jq .jailed` |
| Pending rewards | `safrochaind query distribution rewards <addr> $VALADDR` |
| Withdraw commission | `safrochaind tx distribution withdraw-rewards $VALADDR --commission …` |
| Edit commission | `safrochaind tx staking edit-validator --commission-rate 0.06 …` |
| Edit moniker | `safrochaind tx staking edit-validator --moniker "new-name" …` |
| Self-delegate | `safrochaind tx staking delegate $VALADDR <amount>usaf …` |
| Unbond | `safrochaind tx staking unbond $VALADDR <amount>usaf …` |
| Unjail | `safrochaind tx slashing unjail …` |
| Vote | `safrochaind tx gov vote <id> yes …` |
