---
title: ICS-20 transfer (`ibc-transfer`)
description: "Fungible token transfers over IBC: query ibc-transfer and tx ibc-transfer transfer."
---

The **ICS-20** application handles **fungible token transfers** across IBC channels (`transfer` port).

**CLI root**: `safrochaind query ibc-transfer` and `safrochaind tx ibc-transfer`

:::note App developer note

For **building dApps** that construct ICS-20 packets in JavaScript, see [Developer: IBC transfer](../developers/ibc-transfer.md).

:::

## Query commands

Common queries include **denom traces** for IBC vouchers (`ibc/HASH`), escrow accounts, and escrowed amounts. List everything with:

```bash
safrochaind query ibc-transfer --help
```

## Transaction commands

- `transfer`

Typical flags include `--packet-timeout-height`, `--packet-timeout-timestamp`, source **port** (`transfer`) and **channel** id.

## Example

```bash
safrochaind tx ibc-transfer transfer transfer channel-0 \
  addr_safro1dest... 1000000usaf \
  --from mykey --chain-id SOURCE-CHAIN --fees 5000usaf -y
```

Run `safrochaind tx ibc-transfer transfer --help` for timeout and memo flags.
