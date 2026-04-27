---
title: Local testnet
description: Start a local Safrochain node for development.
---

This is the fastest way to confirm your install works.

## Initialize

```bash
safrochaind init localnode --chain-id safro-testnet-1
```

## Create a key and fund it

```bash
safrochaind keys add validator
safrochaind add-genesis-account "$(safrochaind keys show validator -a)" 1000000000usaf
```

## Create genesis tx and start

```bash
safrochaind gentx validator 700000000usaf --chain-id safro-testnet-1
safrochaind collect-gentxs
safrochaind start
```

