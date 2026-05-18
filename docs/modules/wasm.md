---
title: CosmWasm (`wasm`)
description: "Store, instantiate, execute, and query CosmWasm contracts: wasm module CLI reference."
---

The **wasm** module embeds **CosmWasm** smart contracts (code upload, instantiation, execution, migrations).

**CLI root**: `safrochaind query wasm` and `safrochaind tx wasm`

## Query commands

- Code: `code`, `code-info`, `list-code`, `pinned`, `libwasmvm-version`
- Contracts: `contract`, `contract-history`, `list-contract-by-code`, `list-contracts-by-creator`, `contract-state` (smart queries / raw keys)
- Utilities: `build-address`, `params`

## Transaction commands

- Lifecycle: `store`, `instantiate`, `instantiate2`, `execute`, `migrate`
- Admin: `set-contract-admin`, `clear-contract-admin`, `set-contract-label`, `update-instantiate-config`
- Authz helper: `grant`
- Governance: `submit-proposal`

## Example

```bash
safrochaind query wasm contract addr_safro1contract... --node "$RPC" -o json

safrochaind tx wasm store ./artifacts/my_contract.wasm \
  --from deployer --chain-id safrochain-testnet-1 --gas auto --gas-adjustment 1.3 --gas-prices 0.05usaf -y
```

Use `safrochaind query wasm contract-state smart --help` for JSON query payloads.
