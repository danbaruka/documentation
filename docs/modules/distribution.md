---
title: Distribution
description: "Rewards, commissions, community pool: distribution queries and withdraw transactions."
---

The **distribution** module routes **staking rewards**, **validator commissions**, and **community pool** flows.

**CLI root**: `safrochaind query distribution` and `safrochaind tx distribution`

## Query commands

- Rewards: `rewards`, `rewards-by-validator`, `commission`, `validator-outstanding-rewards`, `validator-distribution-info`, `slashes`
- Addresses: `delegator-withdraw-address`, `delegator-validators`
- Pool: `community-pool`
- `params`

## Transaction commands

- `withdraw-rewards`, `withdraw-all-rewards`
- `set-withdraw-addr`
- `fund-community-pool`, `fund-validator-rewards-pool`

## Example

```bash
safrochaind tx distribution withdraw-all-rewards --from mykey \
  --chain-id safrochain-testnet-1 \
  --gas auto --gas-adjustment 1.3 --gas-prices 0.05usaf -y
```
