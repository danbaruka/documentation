---
title: Fee grant
description: "Grant and revoke allowances so another account can pay fees: query and tx feegrant."
---

The **feegrant** module lets a **granter** pay **transaction fees** for a **grantee** within allowance limits.

**CLI root**: `safrochaind query feegrant` and `safrochaind tx feegrant`

## Query commands

- `grant`
- `grants-by-grantee`
- `grants-by-granter`

## Transaction commands

- `grant`, `revoke`, `prune`

## Example

```bash
safrochaind tx feegrant grant addr_safro1granter... addr_safro1grantee... \
  --spend-limit 1000000usaf --period 3600 --expiration 2026-12-31 \
  --from granterkey --chain-id safrochain-testnet-1 \
  --gas auto --gas-adjustment 1.3 --gas-prices 100000usaf -y
```

Run `safrochaind tx feegrant grant --help` for allowance types (basic, periodic, filtered).
