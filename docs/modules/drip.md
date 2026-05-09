---
title: Drip
description: "Drip distributes tokens to stakers; module params and the distribute-tokens transaction."
---

**Drip** allows controlled **distribution of tokens to all stakers** (typically used by protocol incentives). Parameters are governance-controlled; operators with permission use the distribute transaction.

**CLI root**: `safrochaind query drip` and `safrochaind tx drip`

## Query commands

| Command | Purpose |
| --- | --- |
| `params` | Module parameters. |

## Transaction commands

| Command | Arguments | Purpose |
| --- | --- | --- |
| `distribute-tokens` | `[sender_address] [amount]` | Schedule distribution to stakers in the next block (subject to authorization rules). |

## Examples

```bash
export RPC="tcp://127.0.0.1:26657"
export CHAIN_ID="safrochain-testnet-1"
```

**Queries**

```bash
safrochaind query drip params --node "$RPC" -o json

safrochaind query drip params --node "$RPC"
```

**Transactions** (permissioned sender per chain rules; confirm with `--help`)

```bash
# Inspect required authority and flags before broadcasting
safrochaind tx drip distribute-tokens --help

# Example shape (replace sender and amount; may require gov/module authority)
safrochaind tx drip distribute-tokens addr_safro1sender... 100000000usaf \
  --from authoritykey --chain-id "$CHAIN_ID" --node "$RPC" \
  --gas auto --gas-adjustment 1.3 --gas-prices 100000usaf -y

safrochaind tx drip distribute-tokens addr_safro1sender... 100000000usaf \
  --from authoritykey --chain-id "$CHAIN_ID" --node "$RPC" --dry-run
```

Run `safrochaind tx drip distribute-tokens --help` for required authority and flags.

**Source**: `safrochain-node/x/drip/`
