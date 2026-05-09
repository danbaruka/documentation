---
title: Join testnet
description: Sync a Safrochain node against the live safro-testnet-1 network.
sidebar_position: 5
---

The Safrochain testnet (`safro-testnet-1`) is live and is the easiest way to
exercise the full validator + node + wallet stack end-to-end.

## Network versions

| Network | Chain ID | safrochain-node tag | Go |
| --- | --- | --- | --- |
| Testnet | `safro-testnet-1` | `release/v0.1.0` | `1.23.9` |
| Mainnet | `safrochain-1` | `v0.2.1` | `1.25.8` |

## Endpoints

See [Networks → Testnet endpoints](../networks/testnet-endpoints) for the
canonical list. Quick reference:

| Service | Endpoint |
| --- | --- |
| RPC | [https://rpc.testnet.safrochain.com](https://rpc.testnet.safrochain.com) |
| REST | [https://rest.testnet.safrochain.com](https://rest.testnet.safrochain.com) |
| gRPC | [https://grpc.testnet.safrochain.com/](https://grpc.testnet.safrochain.com/) |
| Faucet | [https://faucet.safrochain.com/](https://faucet.safrochain.com/) |
| Explorer | [https://explorer.safrochain.com/](https://explorer.safrochain.com/) |

## Steps

### 1. Install `safrochaind` (testnet)

Follow the **Testnet** track in [Install](./install) (Go **1.23.9** + branch
**`release/v0.1.0`**), or run the consolidated copy-paste block below.

```bash
# =============================================================================
# Testnet — Go 1.23.9 + safrochaind release/v0.1.0 (Ubuntu / Debian)
# Chain ID: safro-testnet-1
# =============================================================================

# Update package lists and install dependencies
sudo apt update
sudo apt install -y git make jq build-essential

# Download and install Go 1.23.9
wget https://go.dev/dl/go1.23.9.linux-amd64.tar.gz
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go1.23.9.linux-amd64.tar.gz
rm go1.23.9.linux-amd64.tar.gz

# Configure Go environment
export PATH=$PATH:/usr/local/go/bin
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin
mkdir -p $GOPATH

# Persist environment variables
echo 'export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin' >> $HOME/.bashrc
source $HOME/.bashrc

# Verify Go installation
if go version | grep -q "go1.23.9"; then
    echo "Go 1.23.9 installed successfully."
else
    echo "Error: Go 1.23.9 not installed. Check installation steps."
    exit 1
fi

# Build safrochaind release/v0.1.0 (testnet branch — NOT v0.2.x)
git clone https://github.com/Safrochain-Org/safrochain-node ~/safrochain-node
cd ~/safrochain-node
git fetch --tags
git checkout release/v0.1.0
make install
safrochaind version --long | head -5
```

:::warning
Do **not** check out `v0.2.1` for testnet — that tag is for mainnet
(`safrochain-1`) and requires Go 1.25.8.
:::

### 2. Initialise the home directory

```bash
safrochaind init my-moniker --chain-id safro-testnet-1 --home ~/.safrochain-testnet
```

### 3. Replace the placeholder genesis with the testnet's

```bash
curl -L https://raw.githubusercontent.com/Safrochain-Org/safrochain-node/main/networks/safro-testnet-1/genesis.json \
  -o ~/.safrochain-testnet/config/genesis.json

# verify
sha256sum ~/.safrochain-testnet/config/genesis.json
```

The expected SHA-256 is published on the network's GitHub release page.

### 4. Add seeds & peers

Edit `~/.safrochain-testnet/config/config.toml`:

```toml
[p2p]
seeds = "<TESTNET_SEED_NODE_ID>@seed.testnet.safrochain.com:26656"
persistent_peers = ""
addr_book_strict = true
pex = true
```

(The seed node ID is published in the testnet's chain registry; see
[Chain registry](../networks/chain-registry).)

### 5. Set CLI defaults

```bash
safrochaind config chain-id  safro-testnet-1
safrochaind config node      https://rpc.testnet.safrochain.com:443
safrochaind config keyring-backend file
safrochaind config broadcast-mode sync
safrochaind config output  json
```

### 6. (Optional) Statesync for fast catch-up

A fresh sync from genesis takes a long time even on testnet. Statesync
catches up to a recent height in minutes. See [Statesync](./statesync).

### 7. Start

```bash
safrochaind start --home ~/.safrochain-testnet
```

Watch the height climb:

```bash
curl -s http://127.0.0.1:26657/status \
  | jq '.result.sync_info | {latest_block_height, catching_up}'
```

When `catching_up == false`, you're synced.

### 8. Try the chain

```bash
# create a key
safrochaind keys add me --keyring-backend file --home ~/.safrochain-testnet
ME=$(safrochaind keys show me -a --home ~/.safrochain-testnet)

# fund it from the faucet
echo "Drip $ME at https://faucet.safrochain.com/"

# verify
safrochaind query bank balances "$ME" --home ~/.safrochain-testnet
```

You can now [delegate](../cli/staking), [vote on proposals](../cli/governance),
and [send IBC transfers](../ibc/overview) on testnet without any cost.

## Resetting

If the testnet is reset (announced on Discord), re-download the new
`genesis.json`, run:

```bash
safrochaind comet unsafe-reset-all --home ~/.safrochain-testnet
```

…and restart.

## Useful tip: run this as a systemd service

```ini
# /etc/systemd/system/safrochaind-testnet.service
[Unit]
Description=Safrochain testnet node
After=network-online.target

[Service]
Type=simple
User=safrochain
ExecStart=/home/safrochain/go/bin/safrochaind start --home /var/lib/safrochain-testnet
Restart=on-failure
RestartSec=5s
LimitNOFILE=1048576

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now safrochaind-testnet
sudo journalctl -u safrochaind-testnet -f
```
