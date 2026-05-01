---
title: Evidence
description: "Light-client evidence queries (misbehavior proofs)."
---

The **evidence** module stores **misbehavior evidence** (for example equivocation) verified by the consensus layer.

**CLI root**: `safrochaind query evidence`

There are **no routine user `tx evidence` subcommands** in the default CLI surface; evidence handling is integrated with consensus operations.

## Query commands

- `evidence` (by hash)
- `list` (paginated)

## Example

```bash
safrochaind query evidence list --node "$RPC" -o json
```
