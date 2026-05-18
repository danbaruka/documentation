---
title: "Build on Safrochain: developer quickstart"
description: "Choose an RPC/REST endpoint, query chain state, broadcast a transaction, and subscribe to events on Safrochain testnet."
sidebar_position: 1
keywords:
  - Safrochain developer
  - build on Safrochain
  - RPC
  - REST
  - gRPC
  - WebSocket
  - CosmJS
  - broadcast transaction
  - safro-testnet-1
---

This page is the fastest path to a working developer setup on Safrochain.
It assumes **testnet** (`safro-testnet-1`) and focuses on the four primitives
every integration needs:

1. Pick an endpoint (RPC or REST).
2. Query chain state.
3. Broadcast a transaction.
4. Subscribe to events (WebSocket).

For canonical endpoint URLs, see:

- [Testnet endpoints](../networks/testnet-endpoints)
- [Mainnet endpoints](../networks/mainnet-endpoints) (reserved until launch)

## Network constants (testnet)

| Field | Value |
| --- | --- |
| Chain ID | `safro-testnet-1` |
| Base denom | `usaf` |
| 1 SAF | `1_000_000 usaf` |
| Bech32 prefix | `addr_safro` |

## 1) Query via RPC (CometBFT)

RPC is great for **sync status**, **blocks**, and **event subscriptions**.

```bash
RPC="https://rpc.testnet.safrochain.com"

# latest height and catching_up
curl -s "$RPC/status" | jq '.result.sync_info | {latest_block_height, catching_up}'

# node info
curl -s "$RPC/status" | jq '.result.node_info | {network, moniker, version}'

# a specific block
curl -s "$RPC/block?height=1" | jq '.result.block.header | {chain_id, height, time}'
```

## 2) Query via REST (LCD)

REST is great for **module queries** and is the easiest HTTP surface for
backends that do not want gRPC.

```bash
REST="https://rest.testnet.safrochain.com"

# staking validators (first page)
curl -s "$REST/cosmos/staking/v1beta1/validators" | jq '.validators | length'

# bank supply (example)
curl -s "$REST/cosmos/bank/v1beta1/supply" | jq '.supply[0:3]'
```

Pagination example:

```bash
curl -s "$REST/cosmos/staking/v1beta1/validators?pagination.limit=50" \
  | jq '{count: (.validators|length), next_key: .pagination.next_key}'
```

## 3) Broadcast a transaction (CLI path)

The simplest “known good” broadcast path is the CLI. It validates your
endpoints, chain-id, denom, and fee settings before you automate anything.

Create a key:

```bash
safrochaind keys add dev --keyring-backend file
ADDR=$(safrochaind keys show dev -a --keyring-backend file)
echo "$ADDR"
```

Fund it:

- Faucet web: [faucet.safrochain.com](https://faucet.safrochain.com/)
- Discord faucet bot: see [Testnet endpoints](../networks/testnet-endpoints#faucet-discord-faucet-bot)

Send a small transfer (to yourself, or a second test key):

```bash
safrochaind tx bank send dev "$ADDR" 1usaf \
  --chain-id safro-testnet-1 \
  --node https://rpc.testnet.safrochain.com:443 \
  --gas auto --gas-adjustment 1.3 \
  --gas-prices 0.05usaf \
  --keyring-backend file \
  --yes
```

Confirm by querying balances:

```bash
safrochaind query bank balances "$ADDR" \
  --node https://rpc.testnet.safrochain.com:443
```

## 4) Subscribe to events (WebSocket)

CometBFT exposes a WebSocket at `/websocket`. You can use it to subscribe to
transaction events.

With `wscat`:

```bash
# install: npm i -g wscat
wscat -c wss://rpc.testnet.safrochain.com/websocket
```

Then subscribe to new blocks:

```json
{
  "jsonrpc": "2.0",
  "method": "subscribe",
  "id": 1,
  "params": { "query": "tm.event='NewBlock'" }
}
```

Or subscribe to txs:

```json
{
  "jsonrpc": "2.0",
  "method": "subscribe",
  "id": 2,
  "params": { "query": "tm.event='Tx'" }
}
```

## Next: CosmJS

For copy/paste CosmJS (query + signing) examples, continue to:

- [CosmJS examples](./cosmjs)

