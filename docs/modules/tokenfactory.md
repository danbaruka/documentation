---
title: Token factory
description: "Factory-created denoms, admin mint/burn, and metadata: safrochaind query and tx command reference."
---

The **token factory** module (`x/tokenfactory`) lets accounts create new coin denominations and manage admin operations (mint, burn, transfer with admin rights, metadata). It is the usual way to issue application-specific assets on top of the bank module.

**CLI root**: `safrochaind query tokenfactory` and `safrochaind tx tokenfactory`

## Query commands

| Command | Arguments | Purpose |
| --- | --- | --- |
| `params` |  | Module parameters. |
| `denom-authority-metadata` | `[denom]` | Authority metadata for a factory denom. |
| `denoms-from-creator` | `[creator_address]` | All denoms created by an address. |

## Transaction commands

| Command | Arguments | Purpose |
| --- | --- | --- |
| `create-denom` | `[sender] [subdenom]` | Create a new factory denom. |
| `mint` | `[sender] [amount] [mint_to_address]` | Mint to an address (requires denom admin). |
| `burn` | `[sender] [amount] [burn_from_address]` | Burn from an address (admin). |
| `force-transfer` | `[sender] [amount] [from] [to]` | Admin transfer between accounts. |
| `change-admin` | `[sender] [denom] [new_admin]` | Transfer denom admin. |
| `modify-metadata` | `[sender] [metadata]` | Update bank metadata (JSON) for a denom. |

`UpdateParams` is **governance or authority only** and is not exposed as a user transaction in AutoCLI.

## Examples

Set endpoints once (Linux/macOS):

```bash
export RPC="tcp://127.0.0.1:26657"          # or your public RPC host:port
export CHAIN_ID="safrochain-testnet-1"       # match the network you use
```

**Queries**

```bash
safrochaind query tokenfactory params --node "$RPC" -o json

safrochaind query tokenfactory denoms-from-creator addr_safro1creator... --node "$RPC" -o json

safrochaind query tokenfactory denom-authority-metadata factory/addr_safro1creator.../mycoin \
  --node "$RPC" -o json
```

**Transactions** (replace `mykey`, amounts, and addresses)

```bash
# Create a factory denom (full denom becomes factory/<creator>/<subdenom>)
safrochaind tx tokenfactory create-denom addr_safro1creator... mycoin \
  --from mykey --chain-id "$CHAIN_ID" --node "$RPC" \
  --gas auto --gas-adjustment 1.3 --gas-prices 100000usaf -y

# Mint to an address (sender must be denom admin)
safrochaind tx tokenfactory mint addr_safro1creator... \
  1000000factory/addr_safro1creator.../mycoin addr_safro1recipient... \
  --from mykey --chain-id "$CHAIN_ID" --node "$RPC" --gas auto --gas-adjustment 1.3 --gas-prices 100000usaf -y

# Burn from an address (admin)
safrochaind tx tokenfactory burn addr_safro1creator... \
  500000factory/addr_safro1creator.../mycoin addr_safro1holder... \
  --from mykey --chain-id "$CHAIN_ID" --node "$RPC" --gas auto --gas-adjustment 1.3 --gas-prices 100000usaf -y

# Simulate only (no broadcast)
safrochaind tx tokenfactory create-denom addr_safro1creator... mycoin \
  --from mykey --chain-id "$CHAIN_ID" --node "$RPC" --dry-run
```

For each `tx` subcommand, run `safrochaind tx tokenfactory <subcommand> --help` for metadata JSON shape (`modify-metadata`) and remaining flags.

**Source**: `safrochain-node/x/tokenfactory/`
