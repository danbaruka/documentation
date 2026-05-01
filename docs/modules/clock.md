---
title: Clock
description: "Register CosmWasm contracts for periodic clock ticks: queries and register, unregister, unjail transactions."
---

The **clock** module tracks CosmWasm contracts that should receive **scheduled execution** (tick-style automation). Registration ties a contract into the chain’s clock keeper; **unjail** recovers a contract that failed validation rules.

**CLI root**: `safrochaind query clock` and `safrochaind tx clock`

## Query commands

| Command | Arguments | Purpose |
| --- | --- | --- |
| `contracts` |  | All clock-enabled contract addresses. |
| `contract` | `[contract_address]` | Details for one contract. |
| `params` |  | Module parameters. |

## Transaction commands

| Command | Arguments | Purpose |
| --- | --- | --- |
| `register` | `[sender_address] [contract_address]` | Register a clock contract. |
| `unregister` | `[sender_address] [contract_address]` | Remove from clock set. |
| `unjail` | `[sender_address] [contract_address]` | Unjail after a fault condition. |

## Examples

```bash
export RPC="tcp://127.0.0.1:26657"
export CHAIN_ID="safrochain-testnet-1"

CW="addr_safro1clock..."
```

**Queries**

```bash
safrochaind query clock params --node "$RPC" -o json

safrochaind query clock contracts --node "$RPC" -o json

safrochaind query clock contract "$CW" --node "$RPC" -o json
```

**Transactions**

```bash
safrochaind tx clock register addr_safro1owner... "$CW" \
  --from mykey --chain-id "$CHAIN_ID" --node "$RPC" --fees 10000usaf -y

safrochaind tx clock unjail addr_safro1owner... "$CW" \
  --from mykey --chain-id "$CHAIN_ID" --node "$RPC" --fees 10000usaf -y

safrochaind tx clock unregister addr_safro1owner... "$CW" \
  --from mykey --chain-id "$CHAIN_ID" --node "$RPC" --fees 10000usaf -y

safrochaind tx clock register addr_safro1owner... "$CW" \
  --from mykey --chain-id "$CHAIN_ID" --node "$RPC" --dry-run
```

**Source**: `safrochain-node/x/clock/`
