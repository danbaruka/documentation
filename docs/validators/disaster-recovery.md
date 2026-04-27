---
title: Disaster recovery
description: Backup, restore, key recovery, and double-sign recovery procedures for Safrochain validators.
sidebar_position: 10
keywords:
  - disaster recovery
  - validator backup
  - restore validator
  - double-sign recovery
  - tombstoned validator
  - key recovery
  - priv_validator_state
  - state-sync recovery
  - cosmos validator DR
---

A validator without a recovery plan is a one-incident validator. This
page documents the **exact steps** for the four disasters that actually
happen to Cosmos validators: lost host, lost operator key, lost
consensus key, and double-sign.

## What you must back up: and where

| Asset | Purpose | Recovery time goal | Where to store |
| --- | --- | --- | --- |
| Operator mnemonic (24 words) | regenerate operator key, sign txs | minutes | paper or steel, **two** physically separated safes |
| Consensus key (`priv_validator_key.json`): only if local signing | sign blocks | seconds | encrypted USB + cloud KMS bucket |
| Signer config (TMKMS / Horcrux shares) | re-bring up the signer cluster | seconds | one share per cosigner, **never co-located** |
| `node_key.json` | preserve P2P node ID | hours | encrypted backup |
| `app.toml`, `config.toml`, `genesis.json` | reproduce the node config exactly | hours | git repo (no secrets) |
| Encrypted snapshot of `data/` (optional) | skip state-sync | hours | object storage |

> The two things you **cannot** back up after the fact are (1) the
> operator mnemonic and (2) the consensus key. If you have not backed
> them up before disaster, you have no validator anymore.

## Encrypted backup recipe

```bash
# secrets bundle
mkdir -p /tmp/safro-backup
cp ~/.safrochain/config/priv_validator_key.json /tmp/safro-backup/
cp ~/.safrochain/config/node_key.json           /tmp/safro-backup/

# Tar and encrypt with a long passphrase you control
tar -C /tmp -czf - safro-backup \
  | gpg --symmetric --cipher-algo AES256 --output safro-backup-$(date -u +%Y%m%d).tar.gz.gpg

shred -u /tmp/safro-backup/*
rmdir /tmp/safro-backup

sha256sum safro-backup-*.tar.gz.gpg
```

Upload the `.gpg` file to **two** independent destinations: e.g. an
S3-compatible bucket with object lock, plus an encrypted USB stored
off-site. Test the restore once a quarter (see § 5).

## Scenario 1: validator host is lost (cloud goes away)

You still have:

- the operator mnemonic (recoverable on any host)
- the encrypted backup with `priv_validator_key.json` and `node_key.json`
- (or) a healthy remote signer that already holds the consensus key

Recovery steps:

1. **Provision a new host** following [Run a node](../run-a-node/install)
   and [Security](./security).
2. **Sync** with state-sync from a foundation endpoint (fastest path).
3. Stop `safrochaind` while you place the secrets:
   ```bash
   sudo systemctl stop safrochaind
   ```
4. **Place keys** (only if you do **not** use a remote signer):
   ```bash
   gpg --decrypt safro-backup-YYYYMMDD.tar.gz.gpg | tar -xzf - -C /tmp
   sudo install -o safro -g safro -m 600 \
     /tmp/safro-backup/priv_validator_key.json ~/.safrochain/config/
   sudo install -o safro -g safro -m 600 \
     /tmp/safro-backup/node_key.json           ~/.safrochain/config/
   ```
5. **Critical:** initialise `priv_validator_state.json` to a height that
   is **strictly less than the current tip but at least one block lower
   than any height the validator may have signed before the failure**.
   The safe value is to copy the most recent state file you backed up,
   or generate a fresh one with the height set to the chain tip:
   ```bash
   echo '{"height":"0","round":0,"step":0}' \
     | sudo -u safro tee ~/.safrochain/data/priv_validator_state.json
   ```
   > Setting `height: "0"` is safe **only** if you are absolutely sure
   > the previous host has been wiped. If there is **any** chance the
   > old host is still alive somewhere, follow Scenario 4 instead.
6. Start the node: `sudo systemctl start safrochaind`. Watch
   `journalctl -u safrochaind -f`. After catch-up, the validator should
   start signing again at the next block.
7. Confirm the consensus address has not changed: if it has, you
   restored the wrong key:
   ```bash
   safrochaind comet show-address   # must equal addr_safrovalcons1...
   ```

## Scenario 2: operator key compromised

The operator key cannot sign blocks, so this is **not** an emergency.
But it can change commission, withdraw rewards, and vote on governance.

1. Move all foundation/community communications to a **read-only**
   posture immediately.
2. There is no on-chain operator-key rotation in the canonical Cosmos
   SDK. The standard remedy is:
   - **Create a new validator** (new operator key, new moniker variant
     like `my-safro-validator-v2`).
   - Stop self-delegating to the compromised one; ask delegators to
     redelegate.
   - **Unbond** the original; commission and rewards on the unbonding
     stake still flow until the period ends.
3. After the unbonding period, the original validator is dead and the
   compromised key is harmless.

## Scenario 3: consensus key lost (no double-sign yet)

You restored the host but cannot find the consensus key. **Stop the
validator immediately**: running with a freshly generated consensus key
will look like a different validator to the chain (your real validator
will be silent, then jailed, but **not** tombstoned).

1. `sudo systemctl stop safrochaind`.
2. Verify on a peer that you have **fully stopped** producing
   signatures:
   ```bash
   curl -s https://rpc.safrochain.network/validators \
     | jq --arg a "$(safrochaind comet show-address 2>/dev/null)" '.result.validators[] | select(.address==$a)'
   ```
3. Treat as Scenario 1 if you have a backup. If you have **no backup**,
   treat as Scenario 4 (graceful death): there is no on-chain way to
   prove the new key is "you".

## Scenario 4: double-sign / tombstoned {#double-sign-recovery}

The chain has detected two votes from your consensus key at the same
height. Your validator is **permanently jailed (tombstoned)**: it
**cannot be unjailed**. The slash on bonded stake has already happened.

What you do:

1. **Stop the offending host immediately.** Even though more slashes
   cannot be applied to a tombstoned validator, you do not want to add
   more evidence to public dashboards.
2. Communicate. Post a short, honest incident note in your delegator
   channel within an hour: when, what, what is next.
3. **Do not** try to revive the consensus key. It is now toxic: if the
   key signs anything, anywhere, on this chain, again, it is fresh
   evidence. Best practice: destroy the file, retire the signer, rotate
   shares.
4. Withdraw the remaining (non-slashed) self-delegation after the
   unbonding period.
5. Announce a successor:
   - Create a brand-new validator with a brand-new consensus key.
   - Pick a clean moniker (e.g. `my-safro-validator-v2`).
   - Publish a post-mortem with the timeline, root cause, and
     mitigations (most commonly: "we ran two instances during a
     migration without wiping `priv_validator_state.json`" or "our
     remote-signer cluster lost quorum and we manually fell back").
6. Ask delegators to redelegate to the successor. Some will, some will
   not. Earn back trust through uptime over the following months.

## Scenario 5: chain halt / consensus failure

This is rare and almost always a coordinated, network-wide event
(bad upgrade, 1/3+ of voting power offline). Validators do **not**
recover from this in isolation.

1. Confirm with the foundation channel that the chain is halted:
   never assume it from a single node.
2. Wait for guidance: a coordinated upgrade, a rollback to a checkpoint
   block, or a state-export + new genesis.
3. Apply the fix at the agreed time. Going early or late breaks the
   network even more.
4. If the chain is rolled back to a height **below** what your validator
   already signed, you must **restore an older `priv_validator_state.json`**
   that reflects the rollback height, otherwise the chain will think you
   double-signed at first restart.

## DR drills: the only backup that exists is one you have restored

Schedule a quarterly drill:

1. On a **fresh host** (not connected to the production validator),
   restore the encrypted backup.
2. Sync to chain tip via state-sync.
3. Verify the restored consensus address matches the one on-chain.
4. Verify the operator address matches (`safrochaind keys show validator -a`).
5. **Do not** start `safrochaind` with `priv_validator_laddr = ""` and
   the live key: that would double-sign. Either:
   - point this drill node at a **mock signer**, or
   - run with `priv_validator_state.json` height set deliberately
     **higher** than current tip so it refuses to sign anything.
6. Document any step that was unclear; fix the runbook; rinse next
   quarter.

The week your real validator host fails is **not** the week to discover
your backup was empty. Run the drill.
