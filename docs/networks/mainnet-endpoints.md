---
title: Mainnet endpoints
description: Public RPC, REST, gRPC, gRPC-Web, P2P seeds, status, and Grafana for safro-mainnet-1.
sidebar_position: 1
---

:::info Mainnet target
**Target launch:** **Q3 2026.** The endpoints below are the canonical names that
will be served the moment the chain produces its first block. Until then they
resolve only inside the foundation network.
:::

## Chain identity

| Field | Value |
| --- | --- |
| Chain ID | `safro-mainnet-1` |
| Base denom | `usaf` |
| Display denom | `SAF` |
| Conversion | `1 SAF = 1_000_000 usaf` |
| Total supply | `1,000,000,000 SAF` (fixed) |
| Bech32 prefix | `safro` |

## RPC (CometBFT JSON-RPC over HTTPS)

| Name | Endpoint | Role |
| --- | --- | --- |
| `rpc1` | `https://rpc1.safrochain.network` | primary public RPC |
| `rpc2` | `https://rpc2.safrochain.network` | secondary public RPC (archive) |
| `rpc`  | `https://rpc.safrochain.network`  | aggregated alias (round-robins between rpc1/rpc2) |

Common paths:

```bash
curl -s https://rpc.safrochain.network/status | jq .result.sync_info.latest_block_height
curl -s https://rpc.safrochain.network/net_info
curl -s https://rpc.safrochain.network/health
curl -s 'https://rpc.safrochain.network/block?height=1'
# WebSocket
wscat -c wss://rpc.safrochain.network/websocket
```

Unsafe CometBFT methods (`unsafe_dial_seeds`, `unsafe_flush_mempool`, etc.) are
blocked by the public proxy.

## REST / LCD (Cosmos SDK API over HTTPS)

| Name | Endpoint | Role |
| --- | --- | --- |
| `api1` | `https://api1.safrochain.network` | primary REST/LCD |
| `api2` | `https://api2.safrochain.network` | secondary REST/LCD (archive) |
| `api`  | `https://api.safrochain.network`  | aggregated alias |

Examples:

```bash
curl -s https://api.safrochain.network/cosmos/base/tendermint/v1beta1/node_info
curl -s https://api.safrochain.network/cosmos/base/tendermint/v1beta1/syncing
curl -s https://api.safrochain.network/cosmos/staking/v1beta1/validators
curl -s https://api.safrochain.network/cosmos/bank/v1beta1/supply
```

## gRPC (HTTP/2) and gRPC-Web

| Name | Endpoint | Notes |
| --- | --- | --- |
| `grpc1` | `https://grpc1.safrochain.network` | primary gRPC (HTTP/2, TLS required) |
| `grpc2` | `https://grpc2.safrochain.network` | secondary gRPC (HTTP/2, TLS required) |
| `grpc`  | `https://grpc.safrochain.network`  | aggregated alias |
| `grpc-web` | `https://grpc-web.safrochain.network` | browser-friendly gRPC-Web (CosmJS) |

```bash
grpcurl grpc.safrochain.network:443 \
  cosmos.staking.v1beta1.Query/Validators
```

## P2P seeds (CometBFT P2P over TCP)

| Name | Endpoint | Port | Purpose |
| --- | --- | --- | --- |
| `seed`  | `seed.safrochain.network:26666`  | 26666 | primary public seed/sentry |
| `seed2` | `seed2.safrochain.network:26670` | 26670 | secondary public seed/sentry |

Validators **never** accept inbound public P2P; only the public seed nodes
listed above are reachable from the open internet.

## Status page

| Name | Endpoint | Access |
| --- | --- | --- |
| `status`  | `https://status.safrochain.network` | public (read-only) |

## TLS, CORS, and rate limits

- All public endpoints terminate TLS via Let's Encrypt with HSTS, modern
  ciphers, and per-IP rate limits.
- CORS is open on RPC/REST so that browser wallets (Keplr, Leap) can use the
  endpoints directly.
- Unsafe CometBFT JSON-RPC methods (`unsafe_dial_seeds`, `unsafe_flush_mempool`,
  `dial_peers`, `dial_seeds`, …) are blocked at the public proxy.

## Snapshots (optional, post-launch)

| Name | Endpoint | Purpose |
| --- | --- | --- |
| `snapshots` | `https://snapshots.safrochain.network` | downloadable snapshot artifacts |

Snapshots come with a manifest (`height` + `sha256`). Archive snapshots come
from `rpc2` and grow over time.

## What is **not** public

Anything not listed above (validator P2P, internal signing, monitoring
exporters, admin SSH, …) is intentionally firewalled off and is **not**
something you should ever depend on as an external user.
