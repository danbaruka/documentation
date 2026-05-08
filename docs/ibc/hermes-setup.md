---
title: Hermes relayer setup
description: Full Hermes config template, systemd unit, and health checks for relaying Safrochain.
sidebar_position: 2
---

[Hermes](https://hermes.informal.systems/) is the relayer of choice for
Safrochain foundation operators. This page is a copy-paste template that
brings up a single-host relayer between Safrochain and one counterparty.
It applies equally to mainnet (Q3 2026) and testnet today.

## Prerequisites

- Linux server with at least 2 vCPU / 4 GB RAM / 50 GB SSD
- `safrochaind` keyring with a relayer key (with a small `usaf` balance)
- A keyring on the counterparty chain with a small balance of its native fee
  token
- Network access from this server to **all** RPC + gRPC endpoints of both
  chains
- Hermes binary v1.13+, see
  [installation guide](https://hermes.informal.systems/quick-start/installation.html)

## Install Hermes

```bash
curl -L https://github.com/informalsystems/hermes/releases/latest/download/hermes-v1.13-x86_64-unknown-linux-gnu.tar.gz \
  | tar xz -C /usr/local/bin
hermes version
```

## `~/.hermes/config.toml`

```toml
[global]
log_level = 'info'

[mode.clients]
enabled = true
refresh = true
misbehaviour = true

[mode.connections]
enabled = true

[mode.channels]
enabled = true

[mode.packets]
enabled = true
clear_interval = 100
clear_on_start = true
tx_confirmation = true
auto_register_counterparty_payee = true

[rest]
enabled = true
host = '127.0.0.1'
port = 3000

[telemetry]
enabled = true
host = '127.0.0.1'
port = 3001

# ----------------------------------------------------------------------------
# Safrochain (mainnet, uncomment for production)
# ----------------------------------------------------------------------------
[[chains]]
id = 'safrochain-1'
type = 'CosmosSdk'
rpc_addr = 'https://rpc1.safrochain.network:443'
grpc_addr = 'https://grpc1.safrochain.network:443'
event_source = { mode = 'push', url = 'wss://rpc1.safrochain.network/websocket', batch_delay = '500ms' }
rpc_timeout = '15s'
trusted_node = false
account_prefix = 'safro'
key_name = 'relayer-safro'
key_store_type = 'Test'
store_prefix = 'ibc'
default_gas = 200000
max_gas = 4000000
gas_multiplier = 1.3
max_msg_num = 30
max_tx_size = 2097152
max_grpc_decoding_size = 33554432
clock_drift = '5s'
max_block_time = '6s'
ccv_consumer_chain = false
memo_prefix = ''
sequential_batch_tx = false
trusting_period = '14days'
trust_threshold = { numerator = '2', denominator = '3' }
address_type = { derivation = 'cosmos' }

[chains.gas_price]
price = 0.025
denom = 'usaf'

# ----------------------------------------------------------------------------
# Safrochain (testnet, currently live)
# ----------------------------------------------------------------------------
# [[chains]]
# id = 'safro-testnet-1'
# rpc_addr = 'https://rpc.testnet.safrochain.com:443'
# grpc_addr = 'https://grpc.testnet.safrochain.com:443'
# event_source = { mode = 'push', url = 'wss://rpc.testnet.safrochain.com/websocket', batch_delay = '500ms' }
# account_prefix = 'safro'
# key_name = 'relayer-safro-testnet'
# gas_price = { price = 0.025, denom = 'usaf' }
# trust_threshold = { numerator = '2', denominator = '3' }
# trusting_period = '14days'

# ----------------------------------------------------------------------------
# Counterparty (replace with the chain you are bridging to)
# ----------------------------------------------------------------------------
# [[chains]]
# id = 'cosmoshub-4'
# rpc_addr = 'https://rpc.cosmos.network:443'
# grpc_addr = 'https://grpc.cosmos.network:443'
# event_source = { mode = 'push', url = 'wss://rpc.cosmos.network/websocket', batch_delay = '500ms' }
# account_prefix = 'cosmos'
# key_name = 'relayer-cosmoshub'
# gas_price = { price = 0.025, denom = 'uatom' }
# trust_threshold = { numerator = '2', denominator = '3' }
# trusting_period = '14days'
```

## Import the relayer keys

```bash
# Safrochain
hermes keys add \
  --chain safrochain-1 \
  --mnemonic-file <(echo "your 24-word mnemonic")

# Counterparty (example: Cosmos Hub)
hermes keys add \
  --chain cosmoshub-4 \
  --mnemonic-file <(echo "your counterparty mnemonic")
```

Verify:

```bash
hermes keys list --chain safrochain-1
hermes keys balance --chain safrochain-1
```

## Validate the config

```bash
hermes config validate
hermes health-check
```

`health-check` will RPC + gRPC ping every chain and report the trusting
period vs unbonding period.

## Open a transfer channel (one-time, by the foundation)

```bash
hermes create channel \
  --a-chain safrochain-1 \
  --b-chain cosmoshub-4 \
  --a-port transfer \
  --b-port transfer \
  --new-client-connection
```

Channel handshake is recorded in [Channels](./channels) and signed off by
the foundation governance.

## Start as a systemd service

```ini
# /etc/systemd/system/hermes.service
[Unit]
Description=Hermes IBC relayer
After=network-online.target

[Service]
Type=simple
User=hermes
WorkingDirectory=/var/lib/hermes
ExecStart=/usr/local/bin/hermes start
Restart=on-failure
RestartSec=10s
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now hermes
sudo systemctl status hermes
sudo journalctl -u hermes -f
```

## Smoke test

```bash
# from another machine
safrochaind tx ibc-transfer transfer transfer channel-0 \
  cosmos1abc... 1000000usaf \
  --from sender --chain-id safrochain-1 \
  --node https://rpc.safrochain.network:443 \
  --gas auto --gas-adjustment 1.3 --fees 5000usaf -y
```

Watch Hermes log:

```text
INFO ibc::relay::link::relay_path: relayed packets: src_chain=safrochain-1 dst_chain=cosmoshub-4 ...
```

Verify on the counterparty:

```bash
gaiad query bank balances cosmos1abc... | grep ibc/
```

## Health & monitoring

- Prometheus scrape: `127.0.0.1:3001/metrics`
- REST API: `127.0.0.1:3000/version`, `/chains`, `/channels`
- Wallet balance alert: keep `> 5 SAF` and `> 5 ATOM` (or counterparty
  fee token). Alerting is left to the operator's monitoring stack of choice
  (e.g. Prometheus + Alertmanager).
- Hermes upgrades on a `safrochaind` upgrade are usually unnecessary, but
  re-run `hermes config validate` after any chain upgrade to catch
  trusting-period drift.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `client expired` warning | unbonding period > trusting_period | update client (`hermes update client`) |
| stuck packets, `pending` rises | counterparty RPC unhealthy | switch RPC, restart Hermes |
| `gas estimate too low` | counterparty `min_gas_prices` raised | bump `gas_price.price` |
| `account sequence mismatch` | another sender used the same key | wait or rotate key |
| chain handshake fails | port misconfigured (`transfer` ↔ `transfer`) | rerun `create channel` |
