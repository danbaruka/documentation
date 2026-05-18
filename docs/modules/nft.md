---
title: NFT
description: "NFT classes and NFT ownership queries and transfers."
---

The **NFT** module implements the Cosmos SDK **NFT** standard (classes and NFT IDs scoped to classes).

**CLI root**: `safrochaind query nft` and `safrochaind tx nft`

## Query commands

- Class: `class`, `classes`
- NFTs: `nft`, `nfts`, `balance`, `supply`, `owner`

## Transaction commands

- `send`

## Example

```bash
safrochaind query nft class my-class-id --node "$RPC" -o json

safrochaind tx nft send addr_safro1receiver... my-class-id my-token-id \
  --from sender --chain-id safrochain-testnet-1 \
  --gas auto --gas-adjustment 1.3 --gas-prices 0.05usaf -y
```
