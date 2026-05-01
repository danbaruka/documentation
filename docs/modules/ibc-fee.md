---
title: IBC fee (relayer incentives)
description: "Pay fees for incentivized relaying and register payees: query ibc-fee and tx ibc-fee."
---

The **IBC fee** (ICS-29) module lets chains **prepay fees** so relayers can claim incentives for deliver, acknowledgement, and timeout packets.

**CLI root**: `safrochaind query ibc-fee` and `safrochaind tx ibc-fee`

## Query commands

- Channel status: `channel`, `channels`
- Payees: `payee`, `counterparty-payee`
- Packet fees: `packet`, `packets`, `packets-for-channel`
- Totals: `total-recv-fees`, `total-ack-fees`, `total-timeout-fees`

## Transaction commands

- `pay-packet-fee`
- `register-payee`
- `register-counterparty-payee`

## Example

```bash
safrochaind query ibc-fee channels --node "$RPC" -o json
```

Relayers normally automate fee handling; see `safrochaind tx ibc-fee pay-packet-fee --help`.
