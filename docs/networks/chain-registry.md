---
title: Chain registry
description: Cosmos chain-registry style descriptor for Safrochain mainnet and testnet.
sidebar_position: 4
---

These descriptors follow the [`cosmos/chain-registry`](https://github.com/cosmos/chain-registry)
schema so that wallets, explorers, and relayers can auto-configure.

## Mainnet: `safrochain-1` (Q3 2026)

```json
{
  "$schema": "../chain.schema.json",
  "chain_name": "safrochain",
  "status": "upcoming",
  "network_type": "mainnet",
  "website": "https://safrochain.com",
  "pretty_name": "Safrochain",
  "chain_id": "safrochain-1",
  "bech32_prefix": "addr_safro",
  "daemon_name": "safrochaind",
  "node_home": "$HOME/.safrochain",
  "key_algos": ["secp256k1"],
  "slip44": 118,
  "fees": {
    "fee_tokens": [
      { "denom": "usaf", "low_gas_price": 0.01, "average_gas_price": 0.025, "high_gas_price": 0.04 }
    ]
  },
  "staking": { "staking_tokens": [{ "denom": "usaf" }] },
  "codebase": {
    "git_repo": "https://github.com/Safrochain-Org/safrochain-node",
    "recommended_version": "v0.2.0",
    "compatible_versions": ["v0.2.0"],
    "binaries": {},
    "cosmos_sdk_version": "0.50",
    "consensus": { "type": "cometbft", "version": "0.38" }
  },
  "peers": {
    "seeds": [
      { "id": "TBD@seed.safrochain.network",  "address": "seed.safrochain.network:26666",  "provider": "Safrochain Foundation" },
      { "id": "TBD@seed2.safrochain.network", "address": "seed2.safrochain.network:26670", "provider": "Safrochain Foundation" }
    ],
    "persistent_peers": []
  },
  "apis": {
    "rpc":  [
      { "address": "https://rpc1.safrochain.network", "provider": "Safrochain Foundation" },
      { "address": "https://rpc2.safrochain.network", "provider": "Safrochain Foundation" }
    ],
    "rest": [
      { "address": "https://api1.safrochain.network", "provider": "Safrochain Foundation" },
      { "address": "https://api2.safrochain.network", "provider": "Safrochain Foundation" }
    ],
    "grpc": [
      { "address": "grpc1.safrochain.network:443", "provider": "Safrochain Foundation" },
      { "address": "grpc2.safrochain.network:443", "provider": "Safrochain Foundation" }
    ],
    "grpc-web": [
      { "address": "https://grpc-web.safrochain.network", "provider": "Safrochain Foundation" }
    ]
  },
  "explorers": [
    { "kind": "safroexplorer", "url": "https://explorer.safrochain.com/", "tx_page": "https://explorer.safrochain.com/tx/${txHash}" }
  ]
}
```

## Testnet: `safro-testnet-1` (live)

```json
{
  "chain_name": "safrochaintestnet",
  "status": "live",
  "network_type": "testnet",
  "pretty_name": "Safrochain Testnet",
  "chain_id": "safro-testnet-1",
  "bech32_prefix": "addr_safro",
  "daemon_name": "safrochaind",
  "slip44": 118,
  "fees": { "fee_tokens": [{ "denom": "usaf", "low_gas_price": 0.01, "average_gas_price": 0.025, "high_gas_price": 0.04 }] },
  "staking": { "staking_tokens": [{ "denom": "usaf" }] },
  "codebase": {
    "git_repo": "https://github.com/Safrochain-Org/safrochain-node",
    "recommended_version": "v0.1.0",
    "compatible_versions": ["v0.1.0"],
    "cosmos_sdk_version": "0.50",
    "consensus": { "type": "cometbft", "version": "0.38" }
  },
  "apis": {
    "rpc":  [{ "address": "https://rpc.testnet.safrochain.com",  "provider": "Safrochain Foundation" }],
    "rest": [{ "address": "https://rest.testnet.safrochain.com", "provider": "Safrochain Foundation" }],
    "grpc": [{ "address": "grpc.testnet.safrochain.com:443",     "provider": "Safrochain Foundation" }]
  },
  "faucets": [{ "url": "https://faucet.safrochain.com/" }],
  "explorers": [{ "kind": "safroexplorer", "url": "https://explorer.safrochain.com/" }]
}
```

## `assetlist.json` (both networks)

```json
{
  "chain_name": "safrochain",
  "assets": [
    {
      "description": "The native token of Safrochain.",
      "denom_units": [
        { "denom": "usaf", "exponent": 0 },
        { "denom": "saf",  "exponent": 6 }
      ],
      "base": "usaf",
      "name": "Safrochain",
      "display": "saf",
      "symbol": "SAF",
      "coingecko_id": "",
      "logo_URIs": {
        "png": "https://safrochain.com/safcoin.png",
        "svg": "https://safrochain.com/svg/safohcian_logo_white.svg"
      }
    }
  ]
}
```

## SLIP-44 / HD path

Safrochain uses **`coin_type = 118`** (Cosmos), so wallet derivation paths are:

```text
m/44'/118'/0'/0/0
```

This is compatible with Keplr, Leap, Cosmostation, Ledger Cosmos app, and any
CosmJS-based wallet.
