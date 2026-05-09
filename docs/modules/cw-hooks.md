---
title: CW Hooks
description: "Register CosmWasm contracts for staking and governance sudo hooks: queries and register or unregister transactions."
---

**CW Hooks** connects CosmWasm contracts to chain lifecycle hooks so contracts can react to **staking** or **governance** events via sudo messages.

**CLI root**: `safrochaind query cw-hooks` and `safrochaind tx cw-hooks`

## Query commands

| Command | Purpose |
| --- | --- |
| `params` | Module parameters. |
| `staking-contracts` | Contracts registered for staking hooks. |
| `governance-contracts` | Contracts registered for governance hooks. |

## Transaction commands

| Command | Arguments | Purpose |
| --- | --- | --- |
| `register-staking` | `[contract_address] [register_address]` | Register staking hook contract. |
| `register-governance` | `[contract_address] [register_address]` | Register governance hook contract. |
| `unregister-staking` | `[contract_address] [register_address]` | Remove staking hook. |
| `unregister-governance` | `[contract_address] [register_address]` | Remove governance hook. |

## Examples

```bash
export RPC="tcp://127.0.0.1:26657"
export CHAIN_ID="safrochain-testnet-1"

CW="addr_safro1hook..."
REG="addr_safro1admin..."
```

**Queries**

```bash
safrochaind query cw-hooks params --node "$RPC" -o json

safrochaind query cw-hooks staking-contracts --node "$RPC" -o json

safrochaind query cw-hooks governance-contracts --node "$RPC" -o json
```

**Transactions**

```bash
safrochaind tx cw-hooks register-staking "$CW" "$REG" \
  --from mykey --chain-id "$CHAIN_ID" --node "$RPC" --gas auto --gas-adjustment 1.3 --gas-prices 100000usaf -y

safrochaind tx cw-hooks register-governance "$CW" "$REG" \
  --from mykey --chain-id "$CHAIN_ID" --node "$RPC" --gas auto --gas-adjustment 1.3 --gas-prices 100000usaf -y

safrochaind tx cw-hooks unregister-staking "$CW" "$REG" \
  --from mykey --chain-id "$CHAIN_ID" --node "$RPC" --gas auto --gas-adjustment 1.3 --gas-prices 100000usaf -y

safrochaind tx cw-hooks unregister-governance "$CW" "$REG" \
  --from mykey --chain-id "$CHAIN_ID" --node "$RPC" --gas auto --gas-adjustment 1.3 --gas-prices 100000usaf -y

safrochaind tx cw-hooks register-staking "$CW" "$REG" \
  --from mykey --chain-id "$CHAIN_ID" --node "$RPC" --dry-run
```

**Source**: `safrochain-node/x/cw-hooks/`
