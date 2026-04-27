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

## Mainnet: `safro-mainnet-1`

### ICS-20 transfer channels (planned)

| Counterparty | Port | Channel (Safrochain side) | Channel (counterparty) | Foundation relayer | Notes |
| --- | --- | --- | --- | --- | --- |
| Cosmos Hub (`cosmoshub-4`) | `transfer` | TBD | TBD | yes | priority 1, gateway to ATOM |
| Osmosis (`osmosis-1`) | `transfer` | TBD | TBD | yes | priority 1, DEX liquidity |
| Noble (`noble-1`) | `transfer` | TBD | TBD | yes | USDC on-ramp |
| Stride (`stride-1`) | `transfer` | TBD | TBD | yes | liquid staking for SAF |
| Neutron (`neutron-1`) | `transfer` | TBD | TBD | tbd | smart-contract reach |
| Axelar (`axelar-dojo-1`) | `transfer` | TBD | TBD | tbd | EVM/USDC bridge |
| Celestia (`celestia`) | `transfer` | TBD | TBD | tbd | optional DA |

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
