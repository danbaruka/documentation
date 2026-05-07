---
title: Mint
description: "Inflation and minting parameters: query mint (transactions are governance-controlled)."
---

The **mint** module defines **inflation**, **annual provisions**, and minting **parameters** for the staking denom.

**Current inflation**: **5%** (0.05).

**CLI root**: `safrochaind query mint`

The standard binary exposes **query only** for mint (parameter changes go through **governance**, not ad hoc user transactions).

## Query commands

- `params`
- `inflation`
- `annual-provisions`

## Example

```bash
safrochaind query mint inflation --node "$RPC" -o json

safrochaind query mint params --node "$RPC" -o json
```
