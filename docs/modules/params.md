---
title: Params (legacy subspaces)
description: "Legacy params subspace queries for modules still using the params keeper pattern."
---

The **`params`** CLI exposes **legacy parameter subspaces** for modules that still register keys under the global params keeper.

**CLI root**: `safrochaind query params`

Prefer each module’s **`params`** query where available (clearer typing). Use this command when you need **raw bytes** for a historic subspace key.

## Query commands

- `subspace`
- `subspaces`

## Example

```bash
safrochaind query params subspaces --node "$RPC" -o json
```
