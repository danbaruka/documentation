---
title: Slashing & jail
description: Downtime, double-sign, unjailing, and the unbonding period.
sidebar_position: 6
---

Safrochain inherits the Cosmos SDK `slashing` module. Two penalties apply to
validators:

| Offence | Penalty (planned mainnet defaults) | Jail time | Reversibility |
| --- | --- | --- | --- |
| **Downtime** (missing > `signed_blocks_window` × `min_signed_per_window`) | small slash on bonded stake | until `unjail` tx | Yes, via `tx slashing unjail` |
| **Double-sign** (two votes at the same height) | larger slash on bonded stake | permanent jail (tombstoned) | No, validator must restart with a new consensus key |

Final parameter values are confirmed in the genesis file. Always read live
parameters from the chain before depending on them:

```bash
safrochaind query slashing params --node https://rpc.safrochain.network:443
```

## Why downtime happens

- Validator process crashed (OOM, panic, disk full)
- Network partition → validator has 0 P2P peers
- Remote signer / threshold-signer quorum dropped
- Clock drifted > 250 ms (consensus rejects votes)

Build alerts in your monitoring stack for each of these so you fix the root
cause **before** the slashing window closes, then unjail.

## Why double-sign happens (and how to avoid it)

The classic mistake is running **two validators with the same
`priv_validator_key.json`** at the same time. This is impossible with a
properly configured threshold signer (e.g. Horcrux) because no single host
has the full key.

If you ever migrate signing from one host to another **without** a threshold
signer:

1. Stop the old validator and **wipe** `priv_validator_state.json`.
2. Wait at least 1 block of safety margin.
3. Start the new validator.

Never run two `safrochaind` instances with the same consensus key
simultaneously, even briefly.

## Unjailing after downtime

```bash
# 1. find your operator address
VALADDR=$(safrochaind keys show validator --bech val -a)

# 2. confirm you are jailed
safrochaind query staking validator "$VALADDR" \
  --node https://rpc.safrochain.network:443 \
  | yq '.jailed'   # -> true

# 3. submit unjail
safrochaind tx slashing unjail \
  --from validator \
  --chain-id safro-mainnet-1 \
  --gas auto --gas-adjustment 1.3 \
  --fees 5000usaf \
  --node https://rpc.safrochain.network:443 \
  --yes

# 4. verify
safrochaind query staking validator "$VALADDR" | yq '.jailed'   # -> false
```

If the tx fails with `validator still jailed`, you tried to unjail before the
chain considered enough blocks signed. Wait one more
`signed_blocks_window` and retry.

## Unbonding period

Once you submit `tx staking unbond` (or get tombstoned), funds enter the
unbonding queue:

- During unbonding, stake **does not earn rewards** but **can still be slashed**
  for offences that happened before the unbond began.
- The unbonding period for Safrochain follows the standard Cosmos default
  (set in genesis). Read it from the chain:

  ```bash
  safrochaind query staking params \
    --node https://rpc.safrochain.network:443
  ```

- After the unbonding period ends, your stake is freely transferable.

## Self-protection checklist

| Risk | Mitigation |
| --- | --- |
| Disk full | alert on `node_filesystem_avail_bytes` < 15 %; rotate logs; cap snapshots |
| Clock drift | run `chrony`/`ntpd`; alert if offset > 250 ms |
| Lost peers | redundant sentries / persistent peers; alert when peer count < 3 |
| Lost remote-signer quorum | redundant cosigners; alert before the signing window closes |
| Double-sign during migration | wipe `priv_validator_state.json`; never start two instances with the same key |
| Operator key theft | hardware wallet for operator key + threshold signer for consensus key |

## Reading live history

The explorer at `https://explorer.safrochain.com/` exposes per-validator
signing history and missed-block heatmaps, the fastest way to confirm a
suspicion of downtime or jail without digging through node logs.
