---
title: Upgrade
description: "Planned upgrades, applied heights, and authority: query upgrade and governance upgrade proposals."
---

The **upgrade** module coordinates **chain upgrades** (handlers registered in the node binary).

**CLI root**: `safrochaind query upgrade` and `safrochaind tx upgrade`

## Query commands

- `plan`
- `applied`
- `authority`
- `module-versions`

## Transaction commands

- `software-upgrade` (typically submitted **through governance**, not ad hoc)

Operators follow upgrade guides in [Run a node: upgrades](../run-a-node/upgrades.md).

## Example

```bash
safrochaind query upgrade plan --node "$RPC" -o json
```
