---
title: Vesting
description: "Create vesting and permanently locked accounts: tx vesting."
---

The **vesting** module creates **vesting accounts** with delayed or periodic unlock schedules.

**CLI root**: `safrochaind tx vesting` (no dedicated `query vesting` tree; account state is visible via **`query auth account`**)

## Transaction commands

- `create-vesting-account`
- `create-periodic-vesting-account`
- `create-permanent-locked-account`

## Example

```bash
safrochaind tx vesting create-vesting-account addr_safro1dest... 100000000usaf 1749398400 \
  --from funder --chain-id safrochain-testnet-1 --fees 10000usaf -y
```

Run each subcommand with `--help` for schedule flags and time formats.
