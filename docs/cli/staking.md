---
title: Staking
description: Delegate, redelegate, unbond, and run validator operations with safrochaind.
sidebar_position: 4
---

The `staking` module powers Safrochain's proof-of-stake. Delegators bond
`SAF` to validators and earn pro-rata rewards; validators sign blocks and
take a configurable commission.

## Delegator workflow

### Find validators

```bash
# bonded validators sorted by tokens
safrochaind query staking validators --limit 200 -o json \
  | jq -r '.validators
            | map(select(.status == "BOND_STATUS_BONDED"))
            | sort_by(-(.tokens|tonumber))[]
            | "\(.description.moniker)\t\(.operator_address)\t\(.commission.commission_rates.rate)"'
```

### Delegate

```bash
safrochaind tx staking delegate <validator-operator-addr> <amount>usaf \
  --from <delegator-key> \
  --chain-id safrochain-1 \
  --gas auto --gas-adjustment 1.3 --fees 5000usaf \
  -y
```

### Redelegate (move stake)

```bash
safrochaind tx staking redelegate <src-valoper> <dst-valoper> <amount>usaf \
  --from <delegator-key> --chain-id safrochain-1 -y
```

You can only redelegate **between two validators at most once per
unbonding period**, a chain-side anti-frontrun guard.

### Unbond (start exit)

```bash
safrochaind tx staking unbond <validator-operator-addr> <amount>usaf \
  --from <delegator-key> --chain-id safrochain-1 -y
```

Stake enters the unbonding queue. It earns no rewards but **can still be
slashed** for offences that happened before the unbond began.

### Cancel an unbonding (recall)

```bash
safrochaind tx staking cancel-unbond <validator-operator-addr> <amount>usaf <creation-height> \
  --from <delegator-key> --chain-id safrochain-1 -y
```

`creation-height` is the block height where the original unbond was
submitted (look it up via `query staking unbonding-delegation`).

### Query my position

```bash
ME=$(safrochaind keys show alice -a)

# all my delegations
safrochaind query staking delegations "$ME"

# all my pending unbonding entries
safrochaind query staking unbonding-delegations "$ME"

# total tokens delegated to a single validator across all delegators
safrochaind query staking validator <valoper> -o json | jq '.tokens'
```

### Claim rewards

The `distribution` module pays rewards. Claiming rewards is **not** a
staking command, it's:

```bash
safrochaind tx distribution withdraw-rewards <valoper> --from <delegator> -y
# claim rewards from every validator I delegate to:
safrochaind tx distribution withdraw-all-rewards --from <delegator> -y
```

Validators additionally claim **commission**:

```bash
safrochaind tx distribution withdraw-rewards <my-valoper> --commission --from <validator> -y
```

## Validator workflow

For the full create-validator flow, see
[Become a validator](../validators/become-a-validator).

Reference summary:

```bash
# 1. show consensus pubkey for the create-validator payload
safrochaind comet show-validator

# 2. submit create-validator
safrochaind tx staking create-validator validator.json --from validator -y

# 3. edit description / commission later
safrochaind tx staking edit-validator \
  --moniker "new name" \
  --website "https://example.com" \
  --details "Updated bio" \
  --commission-rate 0.06 \
  --from validator -y

# 4. unjail after downtime
safrochaind tx slashing unjail --from validator -y
```

Commission rules:

- `commission-rate` may be raised or lowered by **`commission-max-change-rate`** per day.
- `commission-max-rate` is set at creation and **cannot** be raised later.
- `min-self-delegation` cannot decrease.

## Useful queries

```bash
safrochaind query staking pool                   # bonded vs not_bonded supply
safrochaind query staking params                 # unbonding_time, max_validators, etc.
safrochaind query staking historical-info <h>    # validator set at height h
safrochaind query staking delegations-to <valoper>
safrochaind query staking redelegations <delegator>
```

## Risks worth re-reading

- **Slashing for downtime / double-sign**: see
  [Slashing & jail](../validators/slashing).
- **Unbonding period**: capital is locked while you unbond and still
  slashable for past offences.
- **Validator turning malicious**: redelegate **before** signing slows for
  too long; you can't redelegate during a slashing event.
