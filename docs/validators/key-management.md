---
title: Validator key management
description: Operator vs consensus keys, keyring backends, hardware wallets, and offline backups for Safrochain validators.
sidebar_position: 3
keywords:
  - validator keys
  - operator key
  - consensus key
  - priv_validator_key.json
  - Cosmos keyring
  - hardware wallet
  - Ledger
  - mnemonic backup
  - secp256k1
  - ed25519
---

A Safrochain validator runs on **two distinct keys** with very different
risk profiles. Confusing them is the single most common cause of
production incidents.

## The two keys

| Key | Algorithm | Lives at | Used to | If compromised |
| --- | --- | --- | --- | --- |
| **Operator key** | secp256k1 | keyring on operator workstation (or Ledger) | sign `create-validator`, `edit-validator`, `unjail`, withdraw rewards, governance votes | attacker can drain rewards & change commission, but **cannot** double-sign |
| **Consensus key** | ed25519 | `~/.safrochain/config/priv_validator_key.json` (or remote signer) | sign every block proposal & vote at consensus | attacker can double-sign → permanent jail (tombstoned) |

> Rule of thumb: the **operator key** has a mnemonic and lives with you;
> the **consensus key** has a JSON file and lives with the validator
> process (or, in production, behind a remote signer).

## Operator key

### Generate

```bash
safrochaind keys add validator --keyring-backend file
```

You will be asked for a passphrase, then shown the 24-word BIP-39 mnemonic
**once**. Write it down on paper or steel and store it offline. There is
no recovery if you lose it.

### Recover

```bash
safrochaind keys add validator --recover --keyring-backend file
```

### Inspect

```bash
safrochaind keys list   --keyring-backend file
safrochaind keys show validator -a            --keyring-backend file
safrochaind keys show validator --bech val -a --keyring-backend file
```

| Output | Meaning |
| --- | --- |
| `addr_safro1…` | account address (receives rewards) |
| `addr_safrovaloper1…` | validator operator address (used in `tx staking …`) |

### Keyring backends: pick the right one

| Backend | Where it lives | When to use |
| --- | --- | --- |
| `os` | macOS Keychain / GNOME Keyring / KWallet | desktop workstation |
| `file` | passphrase-encrypted file in `~/.safrochain/keyring-file/` | servers, headless systems |
| `pass` | `pass`-managed GPG store | teams already on `pass` |
| `kwallet` | KDE wallet | desktop only |
| `test` | unencrypted JSON | **never** outside `local-testnet/` |

Set the default once, then drop the flag:

```bash
echo 'export SAFROCHAIN_KEYRING_BACKEND=file' >> ~/.zshrc
```

### Use a Ledger for the operator key

A hardware wallet keeps the operator key off the host entirely. Plug in a
Ledger running the **Cosmos** app, then:

```bash
safrochaind keys add validator --ledger \
  --hd-path "m/44'/118'/0'/0/0"
```

Sign with `--ledger` on every `tx`:

```bash
safrochaind tx staking edit-validator --commission-rate 0.06 \
  --from validator --ledger --keyring-backend file \
  --chain-id safrochain-1 --gas auto --gas-adjustment 1.3 \
  --fees 5000usaf --yes
```

The Ledger displays the message; you press both buttons to confirm.

## Consensus key

The consensus key is **created automatically** on first `safrochaind init`
and lives in two files:

```text
~/.safrochain/config/priv_validator_key.json   # the private key
~/.safrochain/data/priv_validator_state.json   # last height/round signed
```

> The state file is the **double-sign safety latch**. Never copy it to a
> second machine; never run two nodes that share it.

### Read the consensus pubkey

```bash
safrochaind comet show-validator
# {"@type":"/cosmos.crypto.ed25519.PubKey","key":"…"}
```

This is the value you pass to `--pubkey` when calling `create-validator`.

### Read the consensus address

```bash
safrochaind comet show-address
# addr_safrovalcons1...
```

This is the address that appears in CometBFT signing logs and in the
slashing module.

## Backups: exact recipe

What you back up depends on **where the consensus key lives**.

### Without a remote signer (entry-level)

Back up these three things to two **encrypted, offline** locations
(USB + safe-deposit box, two cloud KMS buckets, etc.):

```bash
# 1. operator mnemonic: paper / steel
# (already done at key creation)

# 2. consensus key
gpg --symmetric --cipher-algo AES256 \
  ~/.safrochain/config/priv_validator_key.json
# produces priv_validator_key.json.gpg

# 3. node identity (P2P key)
gpg --symmetric --cipher-algo AES256 \
  ~/.safrochain/config/node_key.json
```

### With a remote signer (recommended)

The validator host has **no consensus key on disk**: back up the signer
configuration instead:

- TMKMS: `tmkms.toml`, the `softsign` or YubiHSM key material, and the
  account index file.
- Horcrux: every cosigner's `ecies_keys.json` and the threshold share
  `rsa_keys.json` / `priv_validator_state.json`.

Treat the threshold shares the same way you treat shares of a
multi-signature wallet: **lose any one, the cluster keeps signing; lose
two of three, you are tombstoned**.

## Rotating keys

| Key | Can it be rotated on a live validator? |
| --- | --- |
| Operator key | No on-chain rotation: create a new validator with the new operator and migrate delegators (rare). |
| Consensus key | **No** in stock Cosmos SDK. The current best practice is to retire the validator and re-launch with a new consensus key. Some chains support `MsgRotateConsPubKey`; Safrochain mainnet will follow the canonical SDK behaviour at launch. |
| Node identity (`node_key.json`) | Yes, regenerate any time. Affects only your peer ID, not consensus. |

## Common mistakes & how to avoid them

| Mistake | Consequence | Fix |
| --- | --- | --- |
| Storing the mnemonic in a password manager only | Single point of failure | Add a paper or steel backup offline |
| Copying `priv_validator_key.json` to a backup VM "just in case" | Risk of double-sign if both run | Use threshold signing instead |
| Running `--keyring-backend test` in production | Plaintext key on disk | Use `file` or `os` |
| Forgetting to back up `node_key.json` | New peer ID after restore → seeds drop you | Back it up alongside the consensus key |
| Using the same secp256k1 key as operator on multiple chains | Cross-chain replay risk | Derive a fresh key per chain (different `--account` index) |
