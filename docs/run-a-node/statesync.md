---
title: Statesync
description: Cryptographic light-client catch-up from a recent height, no tarballs.
sidebar_position: 8
---

Statesync uses CometBFT light-client verification to fetch a recent
state snapshot directly from peers. Unlike a tarball, the result is
cryptographically verified against the validator set itself.

For Safrochain we recommend statesync to **rpc1** + **rpc2** as trust
anchors.

## Prerequisites

- A fresh `safrochaind init` home (no `data/`).
- The chain's `genesis.json` already in place.
- Two trusted RPC URLs that have **statesync = true** in their
  `app.toml` (rpc1 and rpc2 do).

## Configure

Edit `~/.safrochain/config/config.toml`:

```toml
[statesync]
enable = true

# pin a recent trusted height
rpc_servers = "https://rpc1.safrochain.network:443,https://rpc2.safrochain.network:443"
trust_height = <RECENT_HEIGHT>
trust_hash   = "<HEX_BLOCK_HASH_AT_TRUST_HEIGHT>"
trust_period = "168h"   # 7 days; must be <= chain unbonding period
```

Pick `<RECENT_HEIGHT>` and `<HEX_BLOCK_HASH_AT_TRUST_HEIGHT>` with this
one-liner:

```bash
LATEST=$(curl -s https://rpc.safrochain.network/status \
           | jq -r '.result.sync_info.latest_block_height')
TRUST=$((LATEST - 1000))
HASH=$(curl -s "https://rpc.safrochain.network/block?height=$TRUST" \
         | jq -r '.result.block_id.hash')
echo "trust_height = $TRUST"
echo "trust_hash   = \"$HASH\""
```

(1 000 blocks of safety margin is plenty.)

## Configure the snapshot endpoint

In `~/.safrochain/config/app.toml` make sure:

```toml
[state-sync]
snapshot-interval = 1000
snapshot-keep-recent = 2
```

These are read by **the node serving the snapshot**, not the joiner.
rpc1/rpc2 already have these set.

## Start

```bash
safrochaind start
```

You should see log lines like:

```text
INFO Discovering snapshots ...
INFO Discovered snapshot height=2499000 chunks=42
INFO Fetching snapshot chunks ...
INFO Verified snapshot height=2499000 hash=...
INFO Snapshot restored
INFO Catching up from snapshot height to chain tip
```

After a few minutes, a `curl /status` should show `catching_up: false`.

## Why this is safer than a tarball

- The `trust_hash` you paste is verified against the actual chain header at
  `trust_height`.
- The state snapshot's Merkle commitments are checked against the verified
  header.
- A malicious RPC can serve you a fake snapshot, but it cannot forge a
  matching header without forging signatures from > 1/3 of the validator
  set within the trust period.

## When statesync fails

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `no snapshots discovered` | the RPC has no snapshots yet | switch to a different RPC, or wait an hour |
| `light client error: trusted height invalid` | trust_height > chain tip, or stale | refresh trust_height + trust_hash |
| `client expired` mid-restore | trust_period elapsed | increase `trust_period` (≤ unbonding) |
| stuck after restore | bad peers | clear `addrbook.json`, restart |

If statesync fails repeatedly, fall back to a [Snapshot](./snapshots) tarball.

## After you've synced

You can keep statesync enabled. It has no effect once you are at chain
tip. Or set:

```toml
[statesync]
enable = false
```

…to make subsequent restarts faster (skips the discovery handshake).
