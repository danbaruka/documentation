---
title: Governance
description: How Safrochain governance works.
---

Safrochain uses on-chain governance (Cosmos SDK governance patterns) to coordinate upgrades and parameter changes.

## Planned mainnet genesis (anti-spam deposits)

Published mainnet genesis is expected to use the following **gov** deposit floors at chain launch (always confirm with `safrochaind query gov params` on your RPC):

| Parameter | Value |
| --- | --- |
| `min_deposit` | `5000000000usaf` (5,000 SAF) |
| `expedited_min_deposit` | `10000000000usaf` (10,000 SAF) |

Other governance thresholds (voting period, quorum, veto, and so on) ship in genesis as configured for that network; treat the values above as **launch defaults**, not immutably fixed policy.

## Learn more

- Website governance section (overview in whitepaper): `https://safrochain.com/whitepaper`
- Node repository: `safrochain-node/x/` module specs

