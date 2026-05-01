---
title: Crisis
description: "Invariant violation proofs submitted by validators: tx crisis invariant-broken."
---

The **crisis** module halts the chain if an **invariant** fails; privileged actors can submit proofs.

**CLI root**: `safrochaind tx crisis` (query surface is usually unused day-to-day)

## Transaction commands

- `invariant-broken`

This path is for **emergency / privileged** scenarios described in Cosmos SDK operations guides, not normal application traffic.

## Example

See `safrochaind tx crisis invariant-broken --help` for required proof arguments.
