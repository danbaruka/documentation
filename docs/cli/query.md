---
title: Query
description: Every read-only namespace exposed by safrochaind query.
sidebar_position: 6
---

`safrochaind query` is a read-only client. It hits the node specified by
`--node` (default: `tcp://localhost:26657`) and returns gRPC results
formatted as JSON / YAML / text. None of these commands sign or broadcast.

```bash
safrochaind query --help
```

## Common namespaces

| Namespace | Purpose |
| --- | --- |
| `query auth` | accounts, module accounts, sequence numbers |
| `query bank` | balances, supply, denom metadata |
| `query staking` | validators, delegations, redelegations, params |
| `query distribution` | rewards, commission, community pool |
| `query slashing` | signing infos, params |
| `query gov` | proposals, votes, tallies, params |
| `query mint` | inflation, annual provisions, params |
| `query upgrade` | applied/plan upgrades |
| `query ibc-transfer` | denom traces, escrow addresses |
| `query ibc client/connection/channel` | full IBC graph |
| `query feegrant` | fee grants between addresses |
| `query authz` | exec authorisations |
| `query group` | x/group accounts and decisions |
| `query consensus` | consensus params |
| `query block` | block-by-height (height = arg) |
| `query tx` | tx-by-hash |
| `query txs` | tx search by event |

## Cookbook

### Account & sequence number

```bash
safrochaind query auth account addr_safro1abc... -o json \
  | jq '.account.value | {address, account_number, sequence}'
```

### Total supply (`bank.total`)

```bash
safrochaind query bank total --denom usaf
```

### Inflation & community-pool size

```bash
# Inflation target is 7% (0.07); bounds are 3%–14%.
safrochaind query mint inflation
safrochaind query distribution community-pool
```

### Tx by hash

```bash
TX=AB12...
safrochaind query tx "$TX" -o json | jq '.code, .raw_log, .gas_used, .gas_wanted'
```

### Search transactions by event

```bash
# all sends to a given recipient in the last block window
safrochaind query txs --query "transfer.recipient='addr_safro1abc...'" --limit 50
# all delegations from a given delegator
safrochaind query txs --query "delegate.delegator='addr_safro1abc...'" --limit 50
# all proposals created
safrochaind query txs --query "submit_proposal.proposal_id>=1"
```

The query DSL supports `=`, `<`, `<=`, `>=`, and combinations with
spaces.

### Block at a height

```bash
safrochaind query block --type=height 1000
safrochaind query block --type=hash <block-hash>
```

### Validator signing info (downtime tracker)

```bash
safrochaind query slashing signing-infos -o json \
  | jq '.info[] | select(.tombstoned == false) |
        {address, missed_blocks_counter, jailed_until}'
```

`missed_blocks_counter` is reset every `signed_blocks_window`. If it
exceeds `signed_blocks_window * (1 - min_signed_per_window)` the validator
is jailed.

### IBC client expiry

```bash
safrochaind query ibc client states -o json \
  | jq -r '.client_states[] | "\(.client_id)\t\(.client_state.frozen_height.revision_height)\t\(.client_state.latest_height.revision_height)"'
```

### Fee grants (someone is paying my fees)

```bash
ME=$(safrochaind keys show alice -a)
safrochaind query feegrant grants-by-grantee "$ME"
```

## Performance tips

- Use `--height N` to query historical state. Archive nodes keep it back to
  genesis; pruned nodes only keep the last `pruning_keep_recent` blocks.
- Use `-o json | jq` for scripting; never grep raw text output.
- For high-volume reads, run your **own** RPC node. See
  [Run a Node → Join mainnet](../run-a-node/join-mainnet).
