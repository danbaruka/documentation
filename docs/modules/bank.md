---
title: Bank
description: "Balances, supply, denom metadata, and token transfers: query and tx bank commands."
---

The **bank** module tracks **coin balances**, **supply**, **denom metadata**, and enforces send rules.

**CLI root**: `safrochaind query bank` and `safrochaind tx bank`

## Query commands

- Balances and supply: `balance`, `balances`, `total-supply`, `total-supply-of`, `spendable-balance`, `spendable-balances`
- Denoms: `denom-metadata`, `denoms-metadata`, `denom-metadata-by-query-string`, `denom-owners`, `send-enabled`
- `params`

## Transaction commands

- `send`, `multi-send`

## Example

```bash
safrochaind query bank balances addr_safro1... --node "$RPC" -o json

safrochaind tx bank send mykey addr_safro1recv... 1000000usaf \
  --chain-id safrochain-testnet-1 \
  --gas auto --gas-adjustment 1.3 --gas-prices 100000usaf -y
```

More examples: [CLI: Bank](../cli/bank.md).
