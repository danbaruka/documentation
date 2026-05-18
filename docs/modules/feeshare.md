---
title: FeeShare
description: "Route a share of smart-contract execution fees to deployers and withdrawers: queries and registration transactions."
---

**FeeShare** registers CosmWasm contracts so a portion of fees can be directed to **deployer** and **withdrawer** addresses, aligning incentives for protocol maintainers.

**CLI root**: `safrochaind query feeshare` and `safrochaind tx feeshare`

## Query commands

| Command | Arguments | Purpose |
| --- | --- | --- |
| `contracts` |  | All FeeShare registrations. |
| `contract` | `[contract_address]` | Registration for one contract. |
| `params` |  | Module parameters. |
| `deployer-contracts` | `[deployer_address]` | Contracts registered by a deployer. |
| `withdrawer-contracts` | `[withdrawer_address]` | Contracts using a withdrawer address. |

## Transaction commands

| Command | Arguments | Purpose |
| --- | --- | --- |
| `register` | `[contract] [deployer] [withdrawer]` | Register FeeShare for a contract. |
| `cancel` | `[contract] [deployer]` | Cancel registration. |
| `update` | `[contract] [deployer] [withdrawer]` | Update withdrawer (and related fields). |

## Examples

```bash
export RPC="tcp://127.0.0.1:26657"
export CHAIN_ID="safrochain-testnet-1"

CW="addr_safro1contract..."
DEPLOYER="addr_safro1deployer..."
WITHDRAWER="addr_safro1withdrawer..."
```

**Queries**

```bash
safrochaind query feeshare params --node "$RPC" -o json

safrochaind query feeshare contracts --node "$RPC" -o json

safrochaind query feeshare contract "$CW" --node "$RPC" -o json

safrochaind query feeshare deployer-contracts "$DEPLOYER" --node "$RPC" -o json

safrochaind query feeshare withdrawer-contracts "$WITHDRAWER" --node "$RPC" -o json
```

**Transactions**

```bash
safrochaind tx feeshare register "$CW" "$DEPLOYER" "$WITHDRAWER" \
  --from mykey --chain-id "$CHAIN_ID" --node "$RPC" --gas auto --gas-adjustment 1.3 --gas-prices 0.05usaf -y

safrochaind tx feeshare update "$CW" "$DEPLOYER" "$WITHDRAWER" \
  --from mykey --chain-id "$CHAIN_ID" --node "$RPC" --gas auto --gas-adjustment 1.3 --gas-prices 0.05usaf -y

safrochaind tx feeshare cancel "$CW" "$DEPLOYER" \
  --from mykey --chain-id "$CHAIN_ID" --node "$RPC" --gas auto --gas-adjustment 1.3 --gas-prices 0.05usaf -y

safrochaind tx feeshare register "$CW" "$DEPLOYER" "$WITHDRAWER" \
  --from mykey --chain-id "$CHAIN_ID" --node "$RPC" --dry-run
```

**Source**: `safrochain-node/x/feeshare/`
