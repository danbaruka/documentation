---
title: Consensus
description: "CometBFT-related consensus queries and module consensus params."
---

The **consensus** module exposes **CometBFT-related queries** and **module consensus parameters**.

**CLI root**: `safrochaind query consensus`

The default binary lists **`tx consensus`** without additional user subcommands; upgrades to consensus params typically follow governance workflows.

## Query commands

- `params`
- `comet` (service-backed queries for base/tendermint types)

## Example

```bash
safrochaind query consensus params --node "$RPC" -o json
```
