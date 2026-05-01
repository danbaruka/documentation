---
title: Auth
description: "Accounts, sequences, module accounts, and bech32 helpers: safrochaind query auth."
---

The **auth** module manages **accounts**, account numbers, sequences, and **module accounts**. It underpins every signed transaction.

**CLI root**: `safrochaind query auth`

There are **no general `tx auth` subcommands** in the default binary (signing flows use other modules). Transactions identify signers via `--from` and account state comes from here.

## Query commands

- `account`, `account-info`, `accounts`
- `address-by-acc-num`, `address-bytes-to-string`, `address-string-to-bytes`
- `bech32-prefix`
- `module-account`, `module-accounts`
- `params`

## Example

```bash
safrochaind query auth account addr_safro1... --node "$RPC" -o json

safrochaind query auth bech32-prefix --node "$RPC" -o json
```

Official Cosmos SDK reference: [x/auth](https://docs.cosmos.network/main/modules/auth).
