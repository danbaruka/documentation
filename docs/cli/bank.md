---
title: Bank
description: Send SAF, query balances, supply, and denoms with safrochaind.
sidebar_position: 3
---

The `bank` module handles native token transfers and balance queries.
Safrochain's base denom is **`usaf`** (1 SAF = 10^6 usaf). Display denom is
`SAF`.

## Query

```bash
# all balances of an address
safrochaind query bank balances safro1abc...

# balance of one denom
safrochaind query bank balance safro1abc... usaf

# total supply across all denoms (returns ICS-20 IBC denoms too)
safrochaind query bank total

# total supply of a single denom
safrochaind query bank total --denom usaf

# denom metadata (symbol, decimals, description)
safrochaind query bank denom-metadata
safrochaind query bank denom-metadata-by-query-string usaf

# list all denoms ever held by anyone (paginated)
safrochaind query bank denom-owners usaf --limit 100

# query ICS-20 IBC denom info: input the hash
safrochaind query ibc-transfer denom-trace 27A6394C3F9...
```

## Send tokens (`tx bank send`)

```bash
safrochaind tx bank send <from-key-or-address> <to-address> <amount><denom> \
  --chain-id safro-mainnet-1 \
  --node https://rpc.safrochain.network:443 \
  --keyring-backend file \
  --gas auto --gas-adjustment 1.3 \
  --fees 5000usaf \
  -y
```

Example: send 1.5 SAF (= 1 500 000 usaf):

```bash
safrochaind tx bank send alice safro1bob... 1500000usaf \
  --chain-id safro-mainnet-1 -y
```

## Multi-send

Send to multiple recipients in a single tx. Useful for treasury payouts:

```bash
safrochaind tx bank multi-send sender \
  safro1aaa... safro1bbb... safro1ccc... \
  3000000usaf \
  --chain-id safro-mainnet-1 -y
```

The amount (`3000000usaf` here) is sent **to each** recipient, deducted from
the sender.

## Useful patterns

```bash
# pretty-print my balance in SAF (not usaf)
ME=$(safrochaind keys show alice -a)
amt=$(safrochaind query bank balance "$ME" usaf -o json | jq -r '.balance.amount')
echo "$ME : $((amt/1000000)).$((amt%1000000)) SAF"

# wait for a tx to be included
TX=$(safrochaind tx bank send … -o json -y | jq -r '.txhash')
while ! safrochaind query tx "$TX" >/dev/null 2>&1; do sleep 1; done
safrochaind query tx "$TX" -o json | jq '.code, .raw_log'

# fee currencies
safrochaind query bank denom-metadata -o json \
  | jq '.metadatas[] | {denom: .base, symbol: .symbol, decimals: .denom_units[-1].exponent}'
```

## Fees and gas prices

Foundation `min_gas_prices = 0.025usaf`. The simplest way to pay fees:

```bash
--gas auto --gas-adjustment 1.3 --fees 5000usaf
```

For a known-cheap tx (`bank send`):

```bash
--gas 200000 --fees 5000usaf
```

Sub-cent gas is one of Safrochain's design goals. See
[Tokenomics](../protocol/tokenomics) for the full economic model.
