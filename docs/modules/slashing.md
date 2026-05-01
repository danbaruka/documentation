---
title: Slashing
description: "Signing info and downtime penalties: query slashing and tx slashing unjail."
---

The **slashing** module tracks validator **liveness** and **double-sign** evidence and applies penalties.

**CLI root**: `safrochaind query slashing` and `safrochaind tx slashing`

## Query commands

- `params`
- `signing-info`, `signing-infos`

## Transaction commands

- `unjail` (submit after fixing downtime issues)

## Example

```bash
safrochaind query slashing signing-info $(safrochaind tendermint show-validator) --node "$RPC" -o json
```

See [Validators: slashing](../validators/slashing.md).
