---
title: Snapshots
description: Catch up to chain tip from a tarball snapshot, pruned and archive variants.
sidebar_position: 7
---

A snapshot is a tarball of `data/` from a known-good Safrochain node. New
nodes restore from it instead of replaying every block from genesis,
cutting hours-to-days of catch-up to a few minutes.

The foundation publishes two kinds of snapshots:

| Kind | Pruning | Use for |
| --- | --- | --- |
| Pruned (default) | `default` | running a normal full node |
| Archive | `nothing` | running an explorer / indexer / archive RPC |

Snapshot endpoint (post-launch): [https://snapshots.safrochain.network](https://snapshots.safrochain.network).
Each snapshot ships with:

- `safrochain-<chain-id>-<height>-<kind>.tar.lz4`
- `safrochain-<chain-id>-<height>-<kind>.tar.lz4.sha256`

## Restoring (from a stopped node)

```bash
sudo systemctl stop safrochaind

# Wipe data only, NOT config or priv_validator_key.json
rm -rf ~/.safrochain/data
mkdir -p ~/.safrochain/data

# Download (use the archive variant if you want full history)
HEIGHT=2500000
TAR="safrochain-safro-mainnet-1-$HEIGHT-default.tar.lz4"
curl -O "https://snapshots.safrochain.network/$TAR"
curl -O "https://snapshots.safrochain.network/$TAR.sha256"

# Verify checksum
sha256sum -c "$TAR.sha256"

# Untar straight into the data dir
lz4 -d "$TAR" | tar x -C ~/.safrochain/data

# Reset just the priv_validator_state (so a missed-block doesn't double-sign)
echo '{"height":"0","round":0,"step":0}' \
  > ~/.safrochain/data/priv_validator_state.json

sudo systemctl start safrochaind
sudo journalctl -u safrochaind -f
```

The node should boot, replay the few blocks since the snapshot was taken,
and reach chain tip.

## Validating a snapshot's freshness

```bash
# Compare snapshot manifest height vs chain tip
SNAP_HEIGHT=$(curl -s https://snapshots.safrochain.network/manifest.json \
  | jq -r '.snapshots[] | select(.kind=="default") | .height')
TIP=$(curl -s https://rpc.safrochain.network/status \
  | jq -r '.result.sync_info.latest_block_height')

echo "snapshot=$SNAP_HEIGHT tip=$TIP lag=$((TIP-SNAP_HEIGHT)) blocks"
```

The foundation rotates snapshots daily so the lag is always under
~86 400 blocks (~1 day at 1 s/block).

## Producing your own snapshot

If you operate an archive node and want to share a snapshot with the
community, run:

```bash
sudo systemctl stop safrochaind
tar -I lz4 -cvf "safrochain-$(safrochaind status | jq -r '.node_info.network')-$(date +%F)-archive.tar.lz4" \
  -C ~/.safrochain data
shasum -a 256 "safrochain-"*.tar.lz4 > snapshot.sha256
sudo systemctl start safrochaind
```

Don't forget to replicate the artefact off-host (any S3-compatible bucket,
e.g. AWS S3, Cloudflare R2, or Backblaze B2).

## Common pitfalls

- **Forgetting to wipe `priv_validator_state.json`** → at worst a refusal
  to start; at best a stale "last signed height" that is **safe** but
  noisy. The 1-line reset above is enough.
- **Restoring an archive snapshot onto a default-pruned node** → wastes
  disk; pruning kicks in only on **new** blocks.
- **Restoring across chain-ids** → fails. The data dir embeds the
  chain id; never mix snapshots from different networks.
- **Restoring while still acting as a validator** → always make sure your
  validator is jailed / unbonded or that another instance is signing
  before you restore; otherwise you risk missing blocks long enough to be
  jailed.
