---
title: Keys
description: safrochaind keys, add, list, show, export, import, delete.
sidebar_position: 2
---

`safrochaind keys` is a thin wrapper around the Cosmos SDK keyring. It
manages **operator (account)** keys, the keys that hold funds, delegate,
and submit transactions. Consensus keys (`priv_validator_key.json`) are
managed by the node itself and live under `~/.safrochain/config/`.

## Add a new key

```bash
# generate a fresh 24-word mnemonic
safrochaind keys add validator --keyring-backend file

# import from an existing 24-word mnemonic
safrochaind keys add validator --recover --keyring-backend file

# import from a Ledger device (HD path m/44'/118'/0'/0/0)
safrochaind keys add validator --ledger --account 0 --index 0 --keyring-backend file
```

## List, show, delete

```bash
safrochaind keys list --keyring-backend file
safrochaind keys show validator --keyring-backend file
safrochaind keys show validator -a --keyring-backend file          # bech32 account
safrochaind keys show validator --bech val -a --keyring-backend file # bech32 valoper
safrochaind keys delete validator --keyring-backend file
```

## Export / import (encrypted)

```bash
# export passphrase-encrypted armor (safe to copy across hosts)
safrochaind keys export validator --keyring-backend file > validator.armor

# import on the destination host
safrochaind keys import validator validator.armor --keyring-backend file
```

The armor is encrypted with the passphrase you provide on export, safe to
move via SCP/email to a colleague who has the passphrase out-of-band.

## Address formats

| Bech32 prefix | Purpose | Example |
| --- | --- | --- |
| `addr_safro1…` | account address (send/receive) | `addr_safro1qxy2k...` |
| `addr_safropub…` | account public key | rare in CLI use |
| `addr_safrovaloper1…` | validator operator | passed to `tx staking …` |
| `addr_safrovaloperpub…` | validator operator pubkey | rare |
| `addr_safrovalcons1…` | validator consensus address | derived from `priv_validator_key.json` |
| `addr_safrovalconspub…` | validator consensus pubkey | passed to `tx staking create-validator --pubkey` |

Translate between them:

```bash
# valoper from your account key
safrochaind keys show validator --bech val -a

# valcons from priv_validator_key.json
safrochaind comet show-address    # addr_safrovalcons1...
```

## HD path / SLIP-44

Safrochain uses Cosmos `coin_type = 118`. The default derivation path is:

```text
m/44'/118'/0'/0/0
```

This matches Keplr, Leap, Cosmostation, and the Ledger Cosmos app, so the
**same key works in every wallet**.

## Best practices

- Use **`file`** backend with a strong passphrase for any host that signs
  txs.
- Never put the operator key on the validator host. Sign from a separate
  bastion / workstation.
- Keep the 24-word mnemonic on **paper, in 2 sealed copies, in 2 safes**.
  Never type it into a hot machine after creation.
- Optional: use `--ledger` for day-to-day signing; the seed never leaves the
  device.
