---
title: Staking
description: "Validators, delegations, redelegations, unbonding: staking queries and validator transactions."
---

The **staking** module handles **validators**, **delegations**, **redelegations**, and **unbonding**.

**CLI root**: `safrochaind query staking` and `safrochaind tx staking`

## Query commands

- Validator set: `validators`, `validator`, `pool`, `params`
- Delegations: `delegation`, `delegations`, `delegations-to`, `delegator-validator`, `delegator-validators`
- Unbonding / redelegation: `unbonding-delegation`, `unbonding-delegations`, `unbonding-delegations-from`, `redelegation`
- Other: `historical-info`

## Transaction commands

- `create-validator`, `edit-validator`
- `delegate`, `unbond`, `redelegate`, `cancel-unbond`

## Example

```bash
safrochaind query staking validators --node "$RPC" -o json | jq '.validators | length'
```

See also [CLI: Staking](../cli/staking.md) and [Become a validator](../validators/become-a-validator.md).
