---
title: Install safrochaind
description: Build safrochaind from source on Linux or macOS, and verify the binary.
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This page walks you through every step of getting a working `safrochaind`
binary on a fresh machine. Pick the tab that matches your OS and copy the
blocks straight into a terminal.

## Prerequisites

| Tool | Version |
| --- | --- |
| Go | 1.22+ |
| make | any |
| git | any |
| C toolchain | `build-essential` (Linux) or Xcode CLI tools (macOS) |
| OS | Linux x86_64 / arm64, macOS (Intel or Apple Silicon) |

## 1 · Install build tools

<Tabs groupId="os" defaultValue="ubuntu">
  <TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo apt update
sudo apt install -y build-essential git curl jq make pkg-config libssl-dev
```

  </TabItem>
  <TabItem value="rhel" label="Fedora / RHEL">

```bash
sudo dnf install -y @development-tools git curl jq make openssl-devel
```

  </TabItem>
  <TabItem value="macos" label="macOS">

```bash
xcode-select --install || true
brew install git curl jq make
```

  </TabItem>
</Tabs>

## 2 · Install Go 1.22

<Tabs groupId="os" defaultValue="ubuntu">
  <TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
GO_VERSION=1.22.5
ARCH=$(dpkg --print-architecture)        # amd64 or arm64
curl -fsSL "https://go.dev/dl/go${GO_VERSION}.linux-${ARCH}.tar.gz" \
  | sudo tar -C /usr/local -xz

cat <<'EOF' >> ~/.bashrc
export PATH=$PATH:/usr/local/go/bin
export PATH=$PATH:$HOME/go/bin
EOF
source ~/.bashrc

go version
```

  </TabItem>
  <TabItem value="rhel" label="Fedora / RHEL">

```bash
GO_VERSION=1.22.5
ARCH=$(uname -m | sed 's/x86_64/amd64/;s/aarch64/arm64/')
curl -fsSL "https://go.dev/dl/go${GO_VERSION}.linux-${ARCH}.tar.gz" \
  | sudo tar -C /usr/local -xz

cat <<'EOF' >> ~/.bashrc
export PATH=$PATH:/usr/local/go/bin
export PATH=$PATH:$HOME/go/bin
EOF
source ~/.bashrc

go version
```

  </TabItem>
  <TabItem value="macos" label="macOS">

```bash
brew install go

cat <<'EOF' >> ~/.zshrc
export PATH=$PATH:$(go env GOPATH)/bin
EOF
source ~/.zshrc

go version
```

  </TabItem>
</Tabs>

You should see something like `go version go1.22.5 darwin/arm64` (or
`linux/amd64`).

## 3 · Build `safrochaind` from source

<Tabs groupId="os" defaultValue="ubuntu">
  <TabItem value="ubuntu" label="Linux">

```bash
git clone https://github.com/Safrochain-Org/safrochain-node ~/safrochain-node
cd ~/safrochain-node
git fetch --tags
git checkout $(git describe --tags --abbrev=0)   # latest release tag
make install
safrochaind version --long | head -5
```

  </TabItem>
  <TabItem value="macos" label="macOS">

```bash
git clone https://github.com/Safrochain-Org/safrochain-node ~/safrochain-node
cd ~/safrochain-node
git fetch --tags
git checkout $(git describe --tags --abbrev=0)
make install
safrochaind version --long | head -5
```

  </TabItem>
</Tabs>

`make install` puts the binary in `$GOBIN` (defaults to `~/go/bin`). If
`safrochaind` is not on your `$PATH`, run:

```bash
which safrochaind || echo 'export PATH=$PATH:$HOME/go/bin' >> ~/.bashrc
source ~/.bashrc
```

(macOS users: replace `~/.bashrc` with `~/.zshrc`.)

## 4 · Initialise a home directory

```bash
safrochaind init my-moniker \
  --chain-id safro-testnet-1 \
  --home ~/.safrochain
```

This creates `~/.safrochain/{config,data}` with:

- `config/genesis.json`: placeholder, replaced below.
- `config/config.toml`: CometBFT settings.
- `config/app.toml`: Cosmos SDK module settings.
- `config/client.toml`: CLI defaults (`safrochaind config …`).
- `config/priv_validator_key.json`: consensus key (treat as a secret).
- `config/node_key.json`: node ID for P2P.
- `data/`: empty, populated as the chain syncs.

## 5 · Replace the placeholder genesis

For **testnet**:

```bash
curl -fsSL https://raw.githubusercontent.com/Safrochain-Org/safrochain-node/main/networks/safro-testnet-1/genesis.json \
  -o ~/.safrochain/config/genesis.json
```

For **mainnet** (post-launch):

```bash
curl -fsSL https://raw.githubusercontent.com/Safrochain-Org/safrochain-node/main/networks/safro-mainnet-1/genesis.json \
  -o ~/.safrochain/config/genesis.json
```

Verify the SHA-256 against the value published on
[Mainnet endpoints](../networks/mainnet-endpoints) /
[Testnet endpoints](../networks/testnet-endpoints):

```bash
shasum -a 256 ~/.safrochain/config/genesis.json
```

## 6 · Configure CLI defaults

```bash
safrochaind config chain-id        safro-testnet-1
safrochaind config node            https://rpc.testnet.safrochain.com:443
safrochaind config keyring-backend file
safrochaind config broadcast-mode  sync
safrochaind config output          json
```

## 7 · Start the node

Public seeds for testnet and mainnet are listed on
[Networks → Mainnet endpoints](../networks/mainnet-endpoints) and
[Networks → Testnet endpoints](../networks/testnet-endpoints). Configure
them in `~/.safrochain/config/config.toml` (the `seeds` field), then:

```bash
safrochaind start
```

You should see `Started node` and a stream of `Committed state` lines as
the node catches up.

## 8 · Run as a systemd service (Linux)

For 24/7 operation, copy this unit to `/etc/systemd/system/safrochaind.service`:

```ini
[Unit]
Description=Safrochain Node
After=network-online.target

[Service]
User=%u
ExecStart=%h/go/bin/safrochaind start --home %h/.safrochain
Restart=on-failure
RestartSec=5
LimitNOFILE=1048576

[Install]
WantedBy=multi-user.target
```

Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now safrochaind
sudo journalctl -u safrochaind -f
```

On macOS, run `safrochaind start` in a `tmux`/`screen` session, or wrap it
in a `launchd` plist.

## 9 · Upgrading to a new release

```bash
cd ~/safrochain-node
git fetch --tags
git checkout v<next-release>
make install
sudo systemctl restart safrochaind   # Linux only
safrochaind version
```

For coordinated chain upgrades use **cosmovisor** so the binary swap
happens at the upgrade height. See [Upgrades](./upgrades).

## Common issues

| Symptom | Fix |
| --- | --- |
| `make install` fails building `cosmwasm-vm` | install `clang` (`apt install clang` / `brew install llvm`) and retry |
| `safrochaind: command not found` | add `~/go/bin` (or `$(go env GOPATH)/bin` on macOS) to `$PATH` |
| starts then exits with `chain id mismatch` | wrong genesis: redownload the matching one |
| starts but stuck at height 0 | seeds not reachable: recheck the public seeds list on the [Networks](../networks/mainnet-endpoints) page |
| `dial tcp ... i/o timeout` on macOS | check `pf`/firewall and that you're not on a corporate VPN that blocks port 26656 |
