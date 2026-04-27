---
title: Governance
description: Submit proposals, vote, deposit, and query Safrochain on-chain governance.
sidebar_position: 5
---

Safrochain inherits Cosmos SDK 0.50's `gov v1beta1` and `gov v1` flows.
Proposals can be:

- **Text**: purely informational, the chain just records the vote.
- **Param-change**: flip a chain parameter (e.g., min commission, voting
  period).
- **Software upgrade**: schedule `safrochaind` to halt at a height for
  binary swap (used with cosmovisor; see [Upgrades](../run-a-node/upgrades)).
- **Cancel software upgrade**: withdraw a pending upgrade.
- **Community spend**: pay out from the community pool.
- **MsgExec / Generic**: `gov v1` lets you propose any tx that the gov
  account could execute.

## Read live params

```bash
safrochaind query gov params -o json | jq
```

Key fields:

| Field | Meaning |
| --- | --- |
| `min_deposit` | tokens that must be staked to start voting |
| `voting_period` | how long voting lasts once `min_deposit` is reached |
| `quorum` | turnout floor for the proposal to be considered valid |
| `threshold` | yes-vote ratio for the proposal to pass |
| `veto_threshold` | NoWithVeto ratio that immediately kills the proposal |

## Submit a proposal (`gov v1`)

The recommended path is via a JSON payload:

```bash
cat > proposal.json <<EOF
{
  "messages": [],
  "metadata": "ipfs://Qm.../proposal.md",
  "deposit": "10000000usaf",
  "title": "Reduce min_gas_prices to 0.01 usaf",
  "summary": "Cut the min gas price floor to make sub-cent payments cheaper."
}
EOF

safrochaind tx gov submit-proposal proposal.json \
  --from alice --chain-id safro-mainnet-1 \
  --gas auto --gas-adjustment 1.3 --fees 5000usaf -y
```

Add the actual on-chain message (e.g., `MsgUpdateParams`) inside `messages[]`
when you want a concrete change.

## Deposit additional tokens

If `deposit` < `min_deposit`, the proposal sits in deposit period until it
is funded:

```bash
safrochaind tx gov deposit <proposal-id> 5000000usaf \
  --from alice --chain-id safro-mainnet-1 -y
```

Once `min_deposit` is reached, voting begins and the timer for
`voting_period` starts.

## Vote

```bash
safrochaind tx gov vote <proposal-id> <yes|no|abstain|no_with_veto> \
  --from alice --chain-id safro-mainnet-1 -y
```

`weighted-vote` lets you split your stake:

```bash
safrochaind tx gov weighted-vote 12 \
  yes=0.6,no=0.3,abstain=0.1 \
  --from alice -y
```

## Queries

```bash
safrochaind query gov proposals --status voting_period
safrochaind query gov proposal 12
safrochaind query gov tally 12
safrochaind query gov votes 12
safrochaind query gov vote 12 addr_safro1abc...
safrochaind query gov deposits 12
```

## Common message types

| Module | Message | Use |
| --- | --- | --- |
| `cosmos.bank.v1beta1` | `MsgSetSendEnabled` | enable/disable transfers per denom |
| `cosmos.staking.v1beta1` | `MsgUpdateParams` | unbonding time, max validators, min commission |
| `cosmos.distribution.v1beta1` | `MsgUpdateParams` | community tax, base/bonus rates |
| `cosmos.slashing.v1beta1` | `MsgUpdateParams` | downtime / double-sign slashing fractions |
| `cosmos.upgrade.v1beta1` | `MsgSoftwareUpgrade` | schedule a chain upgrade |
| `cosmos.upgrade.v1beta1` | `MsgCancelUpgrade` | cancel a scheduled upgrade |
| `ibc.core.client.v1` | `MsgRecoverClient` | recover an expired IBC client |
| `ibc.core.client.v1` | `MsgIBCSoftwareUpgrade` | schedule IBC client upgrade |

For a software upgrade, `messages[0]` looks like:

```json
{
  "@type": "/cosmos.upgrade.v1beta1.MsgSoftwareUpgrade",
  "authority": "addr_safro10d07y265gmmuvt4z0w9aw880jnsr700jr4l8tn",
  "plan": {
    "name": "v1.1.0",
    "time": "0001-01-01T00:00:00Z",
    "height": "1234567",
    "info": "{\"binaries\":{\"linux/amd64\":\"https://...\"}}",
    "upgraded_client_state": null
  }
}
```

The `authority` address is the gov module account. Read it from chain:

```bash
safrochaind query auth module-account gov -o json \
  | jq -r '.account.value.address'
```

## On-chain reading lists

- [Mintscan](https://www.mintscan.io/) and the foundation explorer at
  [explorer.safrochain.com](https://explorer.safrochain.com/) display
  proposals + tally graphs.
- For proposal discussion, the foundation uses the **#governance** channel
  on Discord plus on-chain `metadata` linking to IPFS markdown.

## Hard-don't list

- Don't propose a `software-upgrade` with a height too close to "now".
  Validators need at least a week to coordinate. A safe minimum is
  `current_height + 1_000_000` (~10 days at ~1 block/s).
- Don't withdraw your deposit by accident; once voting starts you cannot
  cancel.
- Don't vote `no_with_veto` casually; if `veto_threshold` is reached, the
  proposer's deposit is **burned**.
