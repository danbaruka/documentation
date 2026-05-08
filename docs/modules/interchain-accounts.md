---
title: Interchain Accounts
description: "Controller and host ICA queries and transactions (alias: ica)."
---

**Interchain Accounts (ICA)** lets one chain control an account on another chain over IBC.

Mainnet may launch with **ICA controller and host disabled** in genesis (`controller_enabled=false`, `host_enabled=false`) until governance enables them deliberately.

**CLI root**: `safrochaind query interchain-accounts` and `safrochaind tx interchain-accounts`

**Alias**: `safrochaind query ica`, `safrochaind tx ica`

## Query commands

- `controller`: `interchain-account`, `params`
- `host`: additional host-side queries (run `safrochaind query interchain-accounts host --help`)

## Transaction commands

- `controller` (register ICA accounts, submit txs)
- `host` (host-side ICA administration)

```bash
safrochaind query interchain-accounts controller --help
safrochaind tx interchain-accounts controller --help
```
