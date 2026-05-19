---
title: Channels
description: Canonical IBC channel registry for Safrochain mainnet, opens at launch (Q3 2026).
sidebar_position: 3
---

:::info Mainnet IBC channels open at launch (Q3 2026)
Channels listed below are **planned** counterparties. Concrete `channel-id`
values, port handshakes, and IBC denoms will be filled in once the channel
handshake completes on-chain. Until then this page is a registry of intent.
:::

## Mainnet: `safrochain-1`

### ICS-20 transfer channels (planned)

| Counterparty | Port | Channel (Safrochain side) | Channel (counterparty) | Foundation relayer | Notes |
| --- | --- | --- | --- | --- | --- |
| Osmosis (`osmosis-1`) | `transfer` | TBD | TBD | yes (see [Foundation relayer](#foundation-relayer)) | priority 1, DEX liquidity |
| Noble (`noble-1`) | `transfer` | TBD | TBD | yes (see [Foundation relayer](#foundation-relayer)) | USDC on-ramp |

### Foundation relayer

The Safrochain Foundation runs a single Hermes relayer host
(`safro-relayer-1`) that services the following paths today:

| Path | Counterparty | Status |
| --- | --- | --- |
| `safrochain-1` ↔ `osmosis-1` | Osmosis public RPC + gRPC | channel handshake TBD (awaiting mainnet launch) |
| `safrochain-1` ↔ `noble-1` | Noble public RPC + gRPC | channel handshake TBD (awaiting mainnet launch) |
| `osmosis-1` ↔ `noble-1` (transit) | Noble USDC → Osmosis liquidity | live · USDC `uusdc` on Noble · `channel-1` (Noble) ↔ `channel-750` (Osmosis) · IBC denom on Osmosis `ibc/498A0751C798A0D9A389AA3691123DADA57DAA4FE165D5C75894505B876BA6E4` |

Telemetry, version pin (Hermes `v1.10.5`), and provisioning lives in the
private operator repo. The wallets that sign relayed packets are NEVER
checked into source. Operators rotating the wallet only need to swap the
mnemonic file referenced by `hermes keys add`.

### Relayed packet routes — token registry

This sub-section lists each IBC denom that the Foundation relayer is
actively clearing packets for, with the exact channel hops and source
denoms so wallets and explorers can resolve `ibc/<hash>` strings back to
a human name.

#### USDC (Noble → Osmosis) {#usdc-noble-osmosis}

The canonical USDC on Cosmos is minted natively on Noble. Hermes on
`safro-relayer-1` relays the Noble↔Osmosis path, so any Safrochain user
who wants to bridge USDC will land it on Osmosis first.

| Field | Value |
| --- | --- |
| Symbol | `USDC` |
| Base denom (source chain) | `uusdc` on `noble-1` |
| Destination chain | `osmosis-1` |
| Source channel (Osmosis side) | `channel-750` |
| Destination channel (Noble side) | `channel-1` |
| IBC denom on Osmosis | `ibc/498A0751C798A0D9A389AA3691123DADA57DAA4FE165D5C75894505B876BA6E4` |
| Port | `transfer` |
| Trace | `transfer/channel-750/uusdc` |

Verify the hash locally:

```bash
echo -n "transfer/channel-750/uusdc" | shasum -a 256
# 498a0751c798a0d9a389aa3691123dada57daa4fe165d5c75894505b876ba6e4
# IBC denom = ibc/498A0751C798A0D9A389AA3691123DADA57DAA4FE165D5C75894505B876BA6E4
```

#### SAF (Safrochain → Osmosis)

| Field | Value |
| --- | --- |
| Symbol | `SAF` |
| Base denom (source chain) | `usaf` on `safrochain-1` |
| Destination chain | `osmosis-1` |
| Source channel (Osmosis side) | TBD (filled in after `hermes create channel`) |
| Destination channel (Safrochain side) | TBD |
| IBC denom on Osmosis | TBD (`transfer/<channel>/usaf` SHA-256, uppercased, prefixed `ibc/`) |
| Port | `transfer` |
| Trace | `transfer/<TBD>/usaf` |

#### SAF (Safrochain → Noble)

| Field | Value |
| --- | --- |
| Symbol | `SAF` |
| Base denom (source chain) | `usaf` on `safrochain-1` |
| Destination chain | `noble-1` |
| Source channel (Noble side) | TBD |
| Destination channel (Safrochain side) | TBD |
| IBC denom on Noble | TBD |
| Port | `transfer` |
| Trace | `transfer/<TBD>/usaf` |

### ICS-27 (interchain accounts)

| Controller chain | Host port | Status |
| --- | --- | --- |
| Cosmos Hub | `icahost` | enabled at genesis |
| Osmosis | `icahost` | enabled at genesis |
| Neutron | `icahost` | enabled at genesis |

### ICS-721 (NFT transfers)

ICS-721 will be enabled in a post-launch upgrade once a counterparty wires
in the matching `nft-transfer` module. Track progress in
[Governance](../protocol/governance).

## Testnet: `safro-testnet-1`

The testnet runs the same `ibc-go` module set as mainnet but does not
participate in cross-chain testnet relays today. If you want to test IBC
end-to-end, connect two of your **own** local chains using
[Hermes setup](./hermes-setup) and a second `safrochaind` home directory.

## How to read this page once channels open

Each row will resolve into:

- **Channel id**: e.g. `channel-0` on the Safrochain side, `channel-152`
  on the counterparty side.
- **Connection id**: the underlying connection (`connection-0`,
  `connection-1`, …).
- **Client id**: the `07-tendermint-N` light client tracking the
  counterparty.

Compute the IBC denom Safrochain receives from each counterparty:

```bash
echo -n "transfer/<channel-id>/<denom>" | shasum -a 256
# IBC denom = "ibc/" + that hex (uppercased)
```

For example, an Osmosis OSMO arriving on Safrochain over `channel-1` would
be:

```bash
echo -n "transfer/channel-1/uosmo" | shasum -a 256
# 6BB47A66E27D… → ibc/6BB47A66E27D…
```

## Operator coordination

If you want to relay one of the rows above, please coordinate via Discord
`#ibc-relayers`. We track:

- Which operator is running which channel pair (avoid duplicate work, but
  redundancy is healthy)
- ICS-29 fee escrow funding (so you get paid)
- Trusting period vs unbonding period drift (avoids `client expired`)
- Joint upgrade windows so a chain upgrade doesn't trip your relayer

## Updating this page

This file is canonical. When a channel opens or moves, submit a PR to
[`Docs/docs/ibc/channels.md`](https://github.com/Safrochain-Org/safrochain-node/blob/main/Docs/docs/ibc/channels.md)
along with the
[chain registry](../networks/chain-registry) update.
