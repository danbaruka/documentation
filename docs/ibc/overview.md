---
title: IBC overview
description: How Safrochain participates in the Cosmos IBC ecosystem.
sidebar_position: 1
---

Safrochain is built on Cosmos SDK 0.50 with the **`ibc-go`** module enabled,
which means every Safrochain validator is also an IBC participant from
genesis. Out of the box you get:

- **ICS-20 fungible token transfers**: send `SAF` to any IBC-enabled chain
  and receive any IBC token in return (denominated as `ibc/<hash>`).
- **ICS-27 interchain accounts (ICA)**: controllers on other chains can
  open accounts on Safrochain and submit txs as if they were native.
- **ICS-29 fee middleware**: relayer incentivisation built into the chain.
- **ICS-721 NFT transfers**: interchain NFT moves once a counterparty wires
  it up.

Today the chain is in the testnet phase, so channels listed on
[Channels](./channels) are placeholders. They open in lockstep with mainnet
launch (Q3 2026).

## Why a chain operator runs a relayer

IBC is **permissionless**: anyone can run a relayer between two chains. In
practice the foundation runs at least one Hermes relayer per priority
counterparty so that:

- Token transfers in/out of Safrochain don't depend on third-party uptime
- The foundation can pay relayer fees in `SAF` via the `ibcfee` middleware
- Channel handshake bugs and timeout issues get caught fast (alert
  pipeline)

Independent operators are very welcome to relay too; the more redundancy,
the healthier the channel.

## Relayer choices

| Relayer | Language | Status | Recommended for |
| --- | --- | --- | --- |
| **Hermes** (`ibc-relayer-cli`) | Rust | mature | foundation default, see [Hermes setup](./hermes-setup) |
| **`go-relayer`** (`rly`) | Go | mature | Cosmos-native operators familiar with Go tooling |
| **`hermes-rs`** (lite) | Rust | new | embedded / single-channel use-cases |

We document the **Hermes** flow in detail because that is what the
foundation runs. The `rly` flow follows the same chain-config + start-up
pattern.

## Address format on counterparties

When you send `SAF` from Safrochain to another chain over channel-0, your
asset arrives as

```text
ibc/<sha256-of-channel-0-and-usaf>
```

The destination explorer typically resolves this to "SAF (Safrochain)" using
its assetlist. To compute it yourself:

```bash
echo -n "transfer/channel-0/usaf" | shasum -a 256
# <64 hex chars>. IBC denom is "ibc/<that hash uppercased>"
```

## Fees

ICS-29 fee middleware is enabled. A relayer can attach `recv_fee`,
`ack_fee`, and `timeout_fee` to each packet and be paid in `usaf` from a
fee escrow on the source chain. This is what keeps the channel reliable
without anyone running a relayer "out of charity".

## Health monitoring

Hermes ships a Prometheus-compatible metrics endpoint (defaults to
`http://localhost:3001/metrics`). Useful series to graph or alert on:

- `ibc_relayer_packets_relayed_total` (5 m / 1 h rate per channel)
- pending acknowledgements per channel
- relayer wallet balance per chain (alert when below ~5 SAF / equivalent on
  the counterparty chain)
- channel handshake failures

## Where to next

- [Hermes setup](./hermes-setup): full config template, systemd unit,
  health checks.
- [Channels](./channels): canonical channel registry (opens at mainnet).
