---
title: Tx
description: Every signing namespace exposed by safrochaind tx, plus broadcast workflows.
sidebar_position: 7
---

`safrochaind tx` is the signing/broadcasting client. Every command:

1. Builds a tx body from your arguments.
2. Signs it with the key chosen via `--from`.
3. Broadcasts it according to `--broadcast-mode` (`sync`, `async`, `block`).

```bash
safrochaind tx --help
```

## Common namespaces

| Namespace | Purpose | See |
| --- | --- | --- |
| `tx bank` | send / multi-send | [Bank](./bank) |
| `tx staking` | delegate / unbond / redelegate / create-validator / edit-validator | [Staking](./staking) |
| `tx distribution` | withdraw rewards / commission / fund pool | this page |
| `tx slashing` | unjail | [Slashing](../validators/slashing) |
| `tx gov` | submit-proposal / deposit / vote / weighted-vote | [Governance](./governance) |
| `tx authz` | grant / exec / revoke (delegate signing rights) | this page |
| `tx feegrant` | grant / revoke fee allowance | this page |
| `tx group` | x/group accounts and decisions | upstream cosmos docs |
| `tx ibc-transfer` | send IBC token transfer | [IBC overview](../ibc/overview) |
| `tx upgrade` | submit software-upgrade proposal | [Upgrades](../run-a-node/upgrades) |
| `tx wasm` | upload + instantiate + execute CosmWasm contracts | upstream cosmwasm docs |

## Standard flag set

```bash
--from <key>                  # keyring entry
--chain-id safrochain-1
--node https://rpc.safrochain.network:443
--keyring-backend file
--gas auto --gas-adjustment 1.3
--gas-prices 100000usaf
--broadcast-mode sync         # mempool ack, no consensus wait
--output json
-y                            # skip yes/no prompt
```

## Distribution

```bash
# claim rewards from a single validator
safrochaind tx distribution withdraw-rewards <valoper> --from alice -y

# claim rewards from every validator I delegate to
safrochaind tx distribution withdraw-all-rewards --from alice -y

# (validator only) withdraw your commission alongside rewards
safrochaind tx distribution withdraw-rewards <my-valoper> --commission --from validator -y

# donate to the community pool
safrochaind tx distribution fund-community-pool 10000000usaf --from alice -y
```

## Authz: delegate signing without giving up the key

Authz lets a granter authorise a grantee to broadcast specific
`MsgTypes` on its behalf. The grantee pays gas; the granter signs nothing.

```bash
# grant alice's reward-claim authority to the bot
safrochaind tx authz grant <bot-address> generic \
  --msg-type=/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward \
  --expiration $(($(date +%s) + 30*86400)) \
  --from alice -y

# bot claims rewards on alice's behalf
safrochaind tx authz exec tx.json --from bot -y

# revoke
safrochaind tx authz revoke <bot-address> /cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward \
  --from alice -y
```

Build `tx.json` with `safrochaind tx ... --generate-only` first to capture
the exact tx body.

## Feegrant: sponsor someone's fees

```bash
# alice grants up to 1 SAF in fee allowance to bob, valid 30 days
safrochaind tx feegrant grant alice <bob-address> \
  --spend-limit 1000000usaf \
  --expiration $(date -u -d '+30 days' '+%Y-%m-%dT%H:%M:%SZ') \
  --from alice -y

# bob now signs a tx and asks the chain to charge alice's fees
safrochaind tx bank send bob addr_safro1ccc... 1000usaf \
  --fee-granter <alice-address> \
  --from bob --gas auto --gas-adjustment 1.3 --gas-prices 100000usaf -y

# alice revokes
safrochaind tx feegrant revoke alice <bob-address> --from alice -y
```

Useful for onboarding flows where the relayer (or the dApp) pays user fees.

## Generate-only / sign / broadcast

For air-gapped signing or multisig, decompose the standard flow:

```bash
# 1. build unsigned tx
safrochaind tx bank send alice addr_safro1bbb... 1000000usaf \
  --chain-id safrochain-1 --node https://rpc.safrochain.network:443 \
  --gas 200000 --fees 20000000000usaf \
  --generate-only > unsigned.json

# 2. sign offline (or by another keyring)
safrochaind tx sign unsigned.json \
  --from alice --chain-id safrochain-1 \
  --offline --account-number <N> --sequence <S> \
  --keyring-backend file > signed.json

# 3. broadcast from any RPC node
safrochaind tx broadcast signed.json \
  --node https://rpc.safrochain.network:443 \
  --broadcast-mode sync
```

## Multisig

```bash
# 1. create the multisig threshold key
safrochaind keys add board --multisig=alice,bob,carol --multisig-threshold=2

# 2. each signer signs the unsigned tx separately
safrochaind tx sign unsigned.json --from alice --multisig $(safrochaind keys show board -a) > sig-alice.json
safrochaind tx sign unsigned.json --from bob   --multisig $(safrochaind keys show board -a) > sig-bob.json

# 3. combine
safrochaind tx multisign unsigned.json board sig-alice.json sig-bob.json > signed.json

# 4. broadcast
safrochaind tx broadcast signed.json --broadcast-mode sync
```

Multisig is the recommended posture for treasury accounts and for the
foundation operator key.

## After broadcast

`broadcast-mode sync` returns immediately with the tx hash and the mempool
result. To verify inclusion:

```bash
TX=AB12...
while ! safrochaind query tx "$TX" >/dev/null 2>&1; do sleep 1; done
safrochaind query tx "$TX" -o json | jq '{code, raw_log, gas_used, gas_wanted}'
# code == 0 means success
```

If `code != 0`, parse `raw_log` to see the failure reason. Common cases:

- `out of gas` → raise `--gas` or `--gas-adjustment`
- `insufficient fee` → raise `--fees`
- `account sequence mismatch` → another tx is in flight; retry with the
  next sequence number
