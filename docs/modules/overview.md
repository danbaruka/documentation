---
title: Safrochain modules overview
description: "Every module wired into safrochaind: Safrochain extensions, Cosmos SDK core, IBC, and CosmWasm, with CLI entry points and links to per-module reference pages."
keywords:
  - Safrochain modules
  - Cosmos SDK
  - safrochaind CLI
  - x/tokenfactory
  - IBC
  - CosmWasm
---

This reference lists **every application module** registered in [`app/modules.go`](https://github.com/Safrochain-Org/safrochain-node/blob/main/app/modules.go). Use it to find the right doc page and the matching **`safrochaind query`** / **`safrochaind tx`** command tree.

## CLI conventions

- **Discover commands**: run `safrochaind query <module> --help` or `safrochaind tx <module> --help`. Subcommands, positional arguments, and flags are shown there (they match the chain binary you built or installed).
- **Node RPC**: `--node tcp://HOST:26657` (override default `localhost`).
- **Chain ID**: `--chain-id <id>` on transactions.
- **Output**: `-o json` for machine-readable output on queries.
- **Signing (transactions)**:
  - `--from <key_or_address>`: signer.
  - `--fees <coins>` or `--gas auto --gas-adjustment 1.3` (and often `--gas-prices`): fee payment.
  - `-y`: skip confirmation prompt.
  - `--dry-run`: simulate without broadcasting.
  - `--generate-only`: build an unsigned tx (for multisig, hardware wallets, or offline signing).

See also the [CLI overview](../cli/overview.md) for cross-cutting patterns.

## Module index

### Safrochain extensions

| Module | CLI (`query` / `tx`) | Documentation |
| --- | --- | --- |
| **Token factory** (factory denoms) | `tokenfactory` | [Token factory](./tokenfactory.md) |
| **Global fee** (minimum gas prices) | `globalfee` | [Global fee](./globalfee.md) |
| **FeePay** (sponsored contract fees) | `feepay` | [FeePay](./feepay.md) |
| **FeeShare** (contract fee routing) | `feeshare` | [FeeShare](./feeshare.md) |
| **Drip** (staker distribution) | `drip` | [Drip](./drip.md) |
| **Clock** (scheduled CosmWasm ticks) | `clock` | [Clock](./clock.md) |
| **CW Hooks** (staking/gov contract hooks) | `cw-hooks` | [CW Hooks](./cw-hooks.md) |

### Cosmos SDK (standard modules)

| Module | CLI | Documentation |
| --- | --- | --- |
| **Auth** (accounts, sequence) | `auth` | [Auth](./auth.md) |
| **Bank** (balances, supply) | `bank` | [Bank](./bank.md) |
| **Staking** | `staking` | [Staking](./staking.md) |
| **Slashing** | `slashing` | [Slashing](./slashing.md) |
| **Distribution** (rewards, commission) | `distribution` | [Distribution](./distribution.md) |
| **Governance** | `gov` | [Governance](./gov.md) |
| **Mint** | `mint` | [Mint](./mint.md) |
| **Evidence** | `evidence` | [Evidence](./evidence.md) |
| **Fee grant** | `feegrant` | [Fee grant](./feegrant.md) |
| **Authz** (generic authorizations) | `authz` | [Authz](./authz.md) |
| **NFT** | `nft` | [NFT](./nft.md) |
| **Consensus params** | `consensus` | [Consensus](./consensus.md) |
| **Legacy params** | `params` | [Params](./params.md) |
| **Upgrade** | `upgrade` | [Upgrade](./upgrade.md) |
| **Crisis** (invariant checks) | `crisis` (tx only) | [Crisis](./crisis.md) |
| **Vesting** | `vesting` (tx only) | [Vesting](./vesting.md) |

`genutil` is used at **chain initialization** (`init`, `gentx`, `collect-gentxs`), not as a runtime query module. See [Run a node](../run-a-node/overview.md).

### IBC and related apps

| Module | CLI | Documentation |
| --- | --- | --- |
| **IBC core** (clients, connections, channels) | `ibc` | [IBC core](./ibc-core.md) |
| **ICS-20 transfer** | `ibc-transfer` | [ICS-20 transfer](./ibc-transfer-app.md) |
| **IBC relayer incentives** | `ibc-fee` | [IBC fee](./ibc-fee.md) |
| **Interchain Accounts** | `interchain-accounts` (alias `ica`) | [Interchain Accounts](./interchain-accounts.md) |
| **Interchain Queries** | `interchainquery` | [Interchain Queries](./interchain-query.md) |
| **IBC Hooks** (Wasm hooks) | `ibchooks` | [IBC Hooks](./ibc-hooks.md) |

Middleware such as **packet forward** is enabled in the app; routing is typically exercised through IBC transfers and relayers rather than a dedicated top-level CLI.

### CosmWasm

| Module | CLI | Documentation |
| --- | --- | --- |
| **Wasm** | `wasm` | [Wasm](./wasm.md) |

---

For protocol economics and SAF supply, see [Tokenomics](../protocol/tokenomics.md).
