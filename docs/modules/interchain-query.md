---
title: Interchain Queries
description: "Async ICQ module parameters: query interchainquery."
---

**Interchain Queries (ICQ)** allows cross-chain **query requests** subject to host allowlists and security policies.

**CLI root**: `safrochaind query interchainquery`

There is **no separate `tx interchainquery` user menu** in the default listing; integration is primarily **relayer and module driven**.

## Query commands

- `params`

## Example

```bash
safrochaind query interchainquery params --node "$RPC" -o json
```
