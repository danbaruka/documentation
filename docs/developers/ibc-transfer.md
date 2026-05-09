---
title: IBC transfers for apps (ICS-20)
description: "How to send an IBC token transfer from a Safrochain app using CosmJS (ICS-20), plus how to choose channel IDs and timeouts."
sidebar_position: 3
keywords:
  - IBC
  - ICS-20
  - ibc transfer
  - CosmJS IBC transfer
  - MsgTransfer
  - channel id
  - port transfer
  - timeout height
  - timeout timestamp
---

This page is for **app developers** who want to send IBC transfers from
Safrochain (ICS-20). It is not a relayer setup guide. If you are operating a
relayer, see [IBC: Hermes setup](../ibc/hermes-setup).

## What you need

1. A funded account on `safro-testnet-1`
2. A destination chain address (counterparty)
3. A channel ID on Safrochain that connects to the destination chain

Channel IDs are published in the chain’s IBC registry once the channel is live:

- [IBC channels](../ibc/channels)

## Key parameters

| Field | Meaning |
| --- | --- |
| `sourcePort` | always `transfer` for ICS-20 |
| `sourceChannel` | e.g. `channel-0` (must exist on Safrochain) |
| `token.denom` | `usaf` for native SAF, or `ibc/<hash>` for an IBC denom |
| `receiver` | destination chain bech32 address |
| `timeoutHeight` | optional safety cutoff at a specific block height |
| `timeoutTimestamp` | optional safety cutoff in nanoseconds since epoch |

Most apps use **timeoutTimestamp** (recommended) because it is chain-agnostic.

## CosmJS: `MsgTransfer` (timeoutTimestamp)

```ts
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient, assertIsDeliverTxSuccess } from "@cosmjs/stargate";

const RPC = "https://rpc.testnet.safrochain.com:443";
const CHAIN_ID = "safro-testnet-1";
const mnemonic = process.env.MNEMONIC!;

const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
  prefix: "addr_safro",
});
const [{ address: sender }] = await wallet.getAccounts();

const client = await SigningStargateClient.connectWithSigner(RPC, wallet, {
  gasPrice: { denom: "usaf", amount: "100000" },
});

// Replace with a real channel from the IBC registry once live
const sourcePort = "transfer";
const sourceChannel = "channel-0";

const receiver = "cosmos1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
const token = { denom: "usaf", amount: "1000000" }; // 1 SAF

const memo = "ibc test";

// 10 minutes from now, in nanoseconds
const timeoutTimestampNs = BigInt(Date.now() + 10 * 60 * 1000) * 1_000_000n;

const msg = {
  typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
  value: {
    sourcePort,
    sourceChannel,
    token,
    sender,
    receiver,
    timeoutTimestamp: timeoutTimestampNs,
    memo,
  },
};

const res = await client.signAndBroadcast(sender, [msg], "auto");
assertIsDeliverTxSuccess(res);
console.log({ txHash: res.transactionHash, height: res.height });
```

## Choosing a channel ID

There is no universal `channel-0` rule. Your app must pick the right channel
for the destination chain.

Recommended approach:

1. Maintain a small config mapping like `{ chainId -> sourceChannel }`.
2. Update it when the foundation opens new channels (or when channels are
   rotated).
3. For safety, display the channel you intend to use in your UI so operators
   can verify it.

## Common failure modes

| Error | Likely cause | Fix |
| --- | --- | --- |
| `channel not found` | wrong `sourceChannel` | use the published channel registry |
| `insufficient funds` | sender has no `usaf` | use the faucet and retry |
| transfer succeeds but funds “stuck” | relayer downtime | wait for relayer, or retry via different channel |
| timeout | timeout too short | increase timeoutTimestamp to 10–30 minutes |

## Next

- If you need relayer operations: [Hermes setup](../ibc/hermes-setup)\n+- If you need general IBC background: [IBC overview](../ibc/overview)\n+
