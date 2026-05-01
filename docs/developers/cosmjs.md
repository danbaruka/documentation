---
title: CosmJS examples (testnet)
description: "Copy/paste CosmJS snippets for Safrochain testnet: query balances, query validators, sign and broadcast a send transaction."
sidebar_position: 2
keywords:
  - CosmJS
  - "@cosmjs"
  - StargateClient
  - SigningStargateClient
  - Safrochain testnet
  - safro-testnet-1
  - broadcast tx
  - query balances
---

These snippets use **CosmJS** to query and sign transactions on Safrochain
testnet. They are intentionally minimal and copy/paste friendly.

## Prerequisites

- Node.js 20+
- A funded testnet account (see [Testnet endpoints](../networks/testnet-endpoints))

Install deps:

```bash
npm i @cosmjs/stargate @cosmjs/proto-signing @cosmjs/encoding
```

Constants:

```ts
export const RPC = "https://rpc.testnet.safrochain.com:443";
export const CHAIN_ID = "safro-testnet-1";
export const DENOM = "usaf";
```

## 1) Query: latest height + chain-id

```ts
import { StargateClient } from "@cosmjs/stargate";

const client = await StargateClient.connect(RPC);
const height = await client.getHeight();
const chainId = await client.getChainId();
console.log({ chainId, height });
```

## 2) Query: account balance

```ts
import { StargateClient } from "@cosmjs/stargate";

const client = await StargateClient.connect(RPC);
const address = "addr_safro1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

const bal = await client.getBalance(address, DENOM);
console.log(bal); // { denom: 'usaf', amount: '...' }
```

## 3) Query: validators (basic)

```ts
import { StargateClient } from "@cosmjs/stargate";

const client = await StargateClient.connect(RPC);
const validators = await client.getValidators();

console.log(
  validators.slice(0, 5).map((v) => ({
    moniker: v.description?.moniker,
    operatorAddress: v.operatorAddress,
    jailed: v.jailed,
    tokens: v.tokens,
  })),
);
```

## 4) Sign + broadcast: `MsgSend`

This signs a transaction using a mnemonic and broadcasts it using the RPC.

```ts
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient, assertIsDeliverTxSuccess } from "@cosmjs/stargate";

const mnemonic = process.env.MNEMONIC!;
const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
  prefix: "addr_safro",
});
const [{ address: fromAddress }] = await wallet.getAccounts();

const client = await SigningStargateClient.connectWithSigner(RPC, wallet, {
  gasPrice: { denom: DENOM, amount: "0.025" },
});

const toAddress = "addr_safro1yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy";
const amount = [{ denom: DENOM, amount: "1000" }]; // 1000 usaf

const res = await client.sendTokens(fromAddress, toAddress, amount, "auto", "test send");
assertIsDeliverTxSuccess(res);

console.log({ txHash: res.transactionHash, height: res.height });
```

Run it:

```bash
export MNEMONIC="your 24 word phrase here"
node send.mjs
```

## Notes

- Fees: the examples use `gasPrice` of `0.025usaf` and `"auto"` gas.
- Prefix: wallet prefix must be `addr_safro`.
- Production apps should add retries/backoff and handle RPC failures gracefully.

