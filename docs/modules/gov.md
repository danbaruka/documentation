---
title: Governance
description: "Proposals, deposits, votes, and tally: governance queries and submission transactions."
---

The **gov** module implements **on-chain governance** (text and executable proposals, deposits, voting).

Safrochain uses a **wrapped gov** implementation in code; the CLI remains **`gov`** as in upstream Cosmos SDK.

**CLI root**: `safrochaind query gov` and `safrochaind tx gov`

## Query commands

- `proposal`, `proposals`, `deposit`, `deposits`, `vote`, `votes`, `tally`
- `params`, `constitution`

## Transaction commands

- `submit-proposal`, `submit-legacy-proposal`, `draft-proposal`, `cancel-proposal`
- `deposit`, `vote`, `weighted-vote`

## Example

```bash
safrochaind query gov proposals --node "$RPC" --status voting_period -o json
```

See [CLI: Governance](../cli/governance.md).
