---
title: FeePay
description: "FeePay registers CosmWasm contracts that can pay fees on behalf of users, with eligibility and usage queries."
---

**FeePay** lets dApps register **fee payer contracts** so eligible wallets can interact without holding SAF for fees in every scenario (subject to module rules and contract logic).

**CLI root**: `safrochaind query feepay` and `safrochaind tx feepay`

## Query commands

| Command | Arguments | Purpose |
| --- | --- | --- |
| `contract` | `[contract_address]` | Configuration for one FeePay contract. |
| `contracts` |  | All registered FeePay contracts. |
| `uses` | `[contract_address] [wallet_address]` | Usage counters for a wallet on a contract. |
| `is-eligible` | `[contract_address] [wallet_address]` | Whether a wallet is eligible to use FeePay on that contract. |
| `params` |  | Module parameters. |

## Transaction commands

| Command | Arguments | Purpose |
| --- | --- | --- |
| `register` | `[sender_address] [fee_pay_contract]` | Register a contract for FeePay. |
| `unregister` | `[sender_address] [contract_address]` | Remove registration. |
| `fund` | `[sender_address] [contract_address] [amount]` | Fund the fee pool for a contract. |
| `update-wallet-limit` | `[sender_address] [contract_address] [wallet_limit]` | Adjust per-wallet limits. |

## Examples

```bash
export RPC="tcp://127.0.0.1:26657"
export CHAIN_ID="safrochain-testnet-1"

CONTRACT="addr_safro1feecontract..."
WALLET="addr_safro1user..."
```

**Queries**

```bash
safrochaind query feepay params --node "$RPC" -o json

safrochaind query feepay contracts --node "$RPC" -o json

safrochaind query feepay contract "$CONTRACT" --node "$RPC" -o json

safrochaind query feepay uses "$CONTRACT" "$WALLET" --node "$RPC" -o json

safrochaind query feepay is-eligible "$CONTRACT" "$WALLET" --node "$RPC" -o json
```

**Transactions**

```bash
# Register your FeePay CosmWasm contract (addresses match Msg fields)
safrochaind tx feepay register addr_safro1sender... "$CONTRACT" \
  --from mykey --chain-id "$CHAIN_ID" --node "$RPC" --gas auto --gas-adjustment 1.3 --gas-prices 0.05usaf -y

# Top up the contract fee pool
safrochaind tx feepay fund addr_safro1sender... "$CONTRACT" 50000000usaf \
  --from mykey --chain-id "$CHAIN_ID" --node "$RPC" --gas auto --gas-adjustment 1.3 --gas-prices 0.05usaf -y

# Raise per-wallet cap (integer limit per module rules)
safrochaind tx feepay update-wallet-limit addr_safro1sender... "$CONTRACT" 1000 \
  --from mykey --chain-id "$CHAIN_ID" --node "$RPC" --gas auto --gas-adjustment 1.3 --gas-prices 0.05usaf -y

safrochaind tx feepay unregister addr_safro1sender... "$CONTRACT" \
  --from mykey --chain-id "$CHAIN_ID" --node "$RPC" --gas auto --gas-adjustment 1.3 --gas-prices 0.05usaf -y
```

**Source**: `safrochain-node/x/feepay/`
