---
title: Chain registry
description: Cosmos chain-registry style descriptor for Safrochain mainnet and testnet.
sidebar_position: 4
---

These descriptors follow the [`cosmos/chain-registry`](https://github.com/cosmos/chain-registry)
schema so that wallets, explorers, and relayers can auto-configure.

## Mainnet: `safrochain-1` (live — launched 2026-06-25)

```json
{
  "$schema": "../chain.schema.json",
  "chain_name": "safrochain",
  "status": "live",
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
      {
        "denom": "usaf",
        "fixed_min_gas_price": 0.05,
        "low_gas_price": 0.05,
        "average_gas_price": 0.0625,
        "high_gas_price": 0.075
      }
    ]
  },
  "staking": { "staking_tokens": [{ "denom": "usaf" }] },
  "codebase": {
    "git_repo": "https://github.com/Safrochain-Org/safrochain-node",
    "recommended_version": "v0.2.2",
    "compatible_versions": ["v0.2.2"],
    "binaries": {},
    "cosmos_sdk_version": "0.50",
    "consensus": { "type": "cometbft", "version": "0.38" },
    "genesis": {
      "genesis_url": "https://raw.githubusercontent.com/Safrochain-Org/mainnet-genesis/main/genesis.json",
      "genesis_sha256": "c05ac5aec1918df9edb257e8e0eea184d73edc51370eb4aa9f0b4f0aad615c4d",
      "genesis_time": "2026-06-25T10:00:00Z"
    }
  },
  "peers": {
    "seeds": [
      { "id": "bc772fdc9749e6dfd200a9428f07d86fe4fd34ec", "address": "seed.safrochain.network:26666",  "provider": "Safrochain Foundation" },
      { "id": "d323d296ba55e89fb6ce1a724f8da1740bd8cbb0", "address": "seed2.safrochain.network:26670", "provider": "Safrochain Foundation" }
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
  ],
  "ibc": {
    "channels": [
      {
        "chain_1": { "chain_name": "safrochain", "client_id": "07-tendermint-0", "connection_id": "connection-0" },
        "chain_2": { "chain_name": "noble", "client_id": "07-tendermint-224", "connection_id": "connection-210" },
        "port_id": "transfer",
        "channel_id": "channel-0",
        "counterparty": { "port_id": "transfer", "channel_id": "channel-581" },
        "ordering": "unordered",
        "version": "ics20-1",
        "tags": { "status": "live", "preferred": true, "dex": false }
      },
      {
        "chain_1": { "chain_name": "safrochain", "client_id": "07-tendermint-1", "connection_id": "connection-1" },
        "chain_2": { "chain_name": "osmosis", "client_id": "07-tendermint-3719", "connection_id": "connection-11075" },
        "port_id": "transfer",
        "channel_id": "channel-1",
        "counterparty": { "port_id": "transfer", "channel_id": "channel-110497" },
        "ordering": "unordered",
        "version": "ics20-1",
        "tags": { "status": "live", "preferred": true, "dex": true }
      }
    ]
  }
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
  "fees": {
    "fee_tokens": [
      {
        "denom": "usaf",
        "fixed_min_gas_price": 0.05,
        "low_gas_price": 0.05,
        "average_gas_price": 0.0625,
        "high_gas_price": 0.075
      }
    ]
  },
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

## `assetlist.json` (mainnet)

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
    },
    {
      "description": "Circle USDC bridged from Noble over IBC channel-0.",
      "denom_units": [
        { "denom": "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5", "exponent": 0, "aliases": ["uusdc"] },
        { "denom": "USDC", "exponent": 6 }
      ],
      "base": "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5",
      "name": "USD Coin (Noble)",
      "display": "USDC",
      "symbol": "USDC",
      "traces": [
        {
          "type": "ibc",
          "counterparty": { "chain_name": "noble", "base_denom": "uusdc", "channel_id": "channel-581" },
          "chain": { "channel_id": "channel-0", "path": "transfer/channel-0/uusdc" }
        }
      ],
      "logo_URIs": { "svg": "https://raw.githubusercontent.com/cosmos/chain-registry/master/_non-cosmos/ethereum/images/usdc.svg" }
    },
    {
      "description": "Osmosis OSMO bridged over IBC channel-1.",
      "denom_units": [
        { "denom": "ibc/0471F1C4E7AFD3F07702BEF6DC365268D64570F7C1FDC98EA6098DD6DE59817B", "exponent": 0, "aliases": ["uosmo"] },
        { "denom": "OSMO", "exponent": 6 }
      ],
      "base": "ibc/0471F1C4E7AFD3F07702BEF6DC365268D64570F7C1FDC98EA6098DD6DE59817B",
      "name": "Osmosis",
      "display": "OSMO",
      "symbol": "OSMO",
      "traces": [
        {
          "type": "ibc",
          "counterparty": { "chain_name": "osmosis", "base_denom": "uosmo", "channel_id": "channel-110497" },
          "chain": { "channel_id": "channel-1", "path": "transfer/channel-1/uosmo" }
        }
      ],
      "logo_URIs": { "png": "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.png" }
    }
  ]
}
```

SAF on counterparty chains (for wallet/explorer asset lists on Noble and Osmosis):

| Chain | IBC denom | Trace |
| --- | --- | --- |
| Noble | `ibc/416D906365215CB6641B38CCDAA01385AA4B20E5E8EF2D65702A1B3F383FBBA2` | `transfer/channel-581/usaf` |
| Osmosis | `ibc/DBAA4846F611A7603EFCE6F9F46F4F561D48B1F492A576022F000614A17089CE` | `transfer/channel-110497/usaf` |

Full channel topology: [IBC channels](../ibc/channels).

## SLIP-44 / HD path

Safrochain uses **`coin_type = 118`** (Cosmos), so wallet derivation paths are:

```text
m/44'/118'/0'/0/0
```

This is compatible with Keplr, Leap, Cosmostation, Ledger Cosmos app, and any
CosmJS-based wallet.
