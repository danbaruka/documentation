---
title: IBC Hooks (`ibchooks`)
description: "Wasm sender address derivation for IBC Hooks: query ibchooks wasm-sender."
---

The **IBC Hooks** integration derives predictable **Wasm sender addresses** on Safrochain for packets arriving over IBC (used by cross-chain contract calls).

**CLI root**: `safrochaind query ibchooks`

## Query commands

- `wasm-sender`

Arguments: `<channelID>` and `<originalSender>` on the source chain.

## Example

```bash
safrochaind query ibchooks wasm-sender channel-0 juno1abc... --node "$RPC" -o json
```

See upstream **ibc-hooks** documentation for hook payload formats and security considerations.
