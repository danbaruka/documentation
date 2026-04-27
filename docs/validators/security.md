---
title: Security hardening
description: Operating-system hardening, firewall, SSH, fail2ban, and process isolation for Safrochain validator hosts.
sidebar_position: 9
keywords:
  - validator security
  - host hardening
  - SSH hardening
  - fail2ban
  - ufw
  - nftables
  - WireGuard
  - systemd hardening
  - CIS benchmark
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The single best security feature is **less attack surface**. The
validator host should be the most boring Linux machine on your fleet:
no web servers, no docker daemon, no extra users, no container registry.
This page is the minimum you should do **before** the validator ever
holds a consensus key.

## Threat model in one paragraph

The realistic threats are: (1) someone steals SSH credentials and walks
into the host; (2) someone exploits a public service (RPC, P2P) and
escalates; (3) someone with infrastructure access (hosting provider,
malicious admin) reads disk; (4) someone runs a second validator with a
copy of your key. Most of this page reduces (1) and (2). Remote signing
(see [Remote signing](./remote-signing)) is what kills (3) and (4).

## 1 · Dedicated, locked-down user

```bash
sudo adduser --disabled-password --gecos "" safro
sudo usermod -aG sudo safro          # only if this user truly needs sudo
sudo install -d -m 700 -o safro -g safro /home/safro/.safrochain
```

Run `safrochaind` only as the `safro` user. **Never as root.** All file
permissions on `~/.safrochain/` should be `700` (directories) and `600`
(files):

```bash
chmod 700 /home/safro/.safrochain /home/safro/.safrochain/config /home/safro/.safrochain/data
chmod 600 /home/safro/.safrochain/config/*.json /home/safro/.safrochain/config/*.toml
```

## 2 · SSH

Edit `/etc/ssh/sshd_config.d/99-validator.conf`:

```text
PermitRootLogin no
PasswordAuthentication no
ChallengeResponseAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
PermitEmptyPasswords no
X11Forwarding no
AllowAgentForwarding no
AllowTcpForwarding no
ClientAliveInterval 300
ClientAliveCountMax 2
LoginGraceTime 30
MaxAuthTries 3
AllowUsers safro
Port 22
```

Then:

```bash
sudo sshd -t && sudo systemctl restart ssh
```

> Even better: do not expose port 22 to the internet at all. Put SSH
> behind a **WireGuard** mesh (see § 5 below) and source-restrict 22 to
> `10.0.0.0/8`.

### Recommended: ed25519 + YubiKey

```bash
# on your laptop, with a YubiKey 5 plugged in
ssh-keygen -t ed25519-sk -O resident -O verify-required -O application=ssh:safro

# copy the public key to the validator
ssh-copy-id -i ~/.ssh/id_ed25519_sk.pub safro@validator
```

Each SSH login now requires a physical touch on the YubiKey. No password
list, no leaked SSH key on a stolen laptop.

## 3 · Firewall: `ufw` quick recipe

<Tabs groupId="firewall" defaultValue="ufw">
  <TabItem value="ufw" label="ufw (Ubuntu/Debian)">

```bash
sudo apt install -y ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing

# SSH only from the ops bastion
sudo ufw allow from 198.51.100.10 to any port 22 proto tcp

# P2P only from sentries
sudo ufw allow from 10.0.0.21 to any port 26656 proto tcp
sudo ufw allow from 10.0.0.22 to any port 26656 proto tcp

# Privval only from the signer cluster
sudo ufw allow from 10.0.5.0/24 to any port 26659 proto tcp

# Prometheus scrape
sudo ufw allow from 10.0.9.10 to any port 26660 proto tcp
sudo ufw allow from 10.0.9.10 to any port 9100  proto tcp

sudo ufw --force enable
sudo ufw status numbered
```

  </TabItem>
  <TabItem value="nftables" label="nftables (Debian 12+)">

```bash
sudo nft 'add table inet filter'
sudo nft 'add chain inet filter input { type filter hook input priority 0 ; policy drop; }'
sudo nft 'add rule inet filter input ct state established,related accept'
sudo nft 'add rule inet filter input iif lo accept'

sudo nft 'add rule inet filter input ip saddr 198.51.100.10 tcp dport 22 accept'
sudo nft 'add rule inet filter input ip saddr 10.0.0.21    tcp dport 26656 accept'
sudo nft 'add rule inet filter input ip saddr 10.0.0.22    tcp dport 26656 accept'
sudo nft 'add rule inet filter input ip saddr 10.0.5.0/24  tcp dport 26659 accept'
sudo nft 'add rule inet filter input ip saddr 10.0.9.10    tcp dport { 26660, 9100 } accept'
```

Persist: `sudo nft list ruleset > /etc/nftables.conf`.

  </TabItem>
  <TabItem value="aws" label="AWS / GCP security groups">

Treat the cloud security group as your **only** ingress rule. Default
everything to deny, then allow:

| Source | Protocol | Port | Note |
| --- | --- | --- | --- |
| ops bastion SG | TCP | 22 | SSH |
| sentry SG | TCP | 26656 | P2P |
| signer SG | TCP | 26659 | TMKMS / Horcrux |
| observability SG | TCP | 26660, 9100 | Prometheus |

  </TabItem>
</Tabs>

## 4 · `fail2ban`: block brute force

```bash
sudo apt install -y fail2ban
```

`/etc/fail2ban/jail.local`:

```ini
[DEFAULT]
bantime  = 24h
findtime = 30m
maxretry = 3
backend  = systemd

[sshd]
enabled = true
port    = 22
```

```bash
sudo systemctl enable --now fail2ban
sudo fail2ban-client status sshd
```

This is more belt-and-suspenders if SSH is already private (§ 2 + § 3).
On a 0.0.0.0/0 SSH, it is essential.

## 5 · WireGuard mesh (recommended)

Replace public SSH and reverse-proxy the privval / metrics traffic over
a tiny WireGuard mesh:

```bash
sudo apt install -y wireguard
wg genkey | tee server.key | wg pubkey > server.pub
```

`/etc/wireguard/wg0.conf` on the validator:

```ini
[Interface]
Address = 10.10.0.1/24
PrivateKey = <server.key>
ListenPort = 51820

[Peer]
PublicKey = <ops_laptop.pub>
AllowedIPs = 10.10.0.10/32
```

Now firewall: drop **all** SSH except from `10.10.0.0/24`. The validator
host has no public SSH or RPC port; everything operational happens over
WireGuard.

## 6 · `systemd` service hardening

`/etc/systemd/system/safrochaind.service` should include:

```ini
[Service]
User=safro
Group=safro
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=read-only
ReadWritePaths=/home/safro/.safrochain
PrivateTmp=true
PrivateDevices=true
ProtectKernelModules=true
ProtectKernelTunables=true
ProtectKernelLogs=true
ProtectControlGroups=true
RestrictNamespaces=true
RestrictRealtime=true
RestrictSUIDSGID=true
LockPersonality=true
MemoryDenyWriteExecute=true
SystemCallArchitectures=native
LimitNOFILE=65535
```

Verify the unit still starts:

```bash
sudo systemctl daemon-reload
sudo systemctl restart safrochaind
sudo systemd-analyze security safrochaind   # aim for "exposure" < 3.0
```

## 7 · OS patching

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

`/etc/apt/apt.conf.d/52unattended-upgrades-local`:

```text
Unattended-Upgrade::Automatic-Reboot "false";
Unattended-Upgrade::Mail "ops@example.com";
```

We disable automatic reboots: a kernel update mid-block is worse than a
delayed patch. Schedule reboots manually during low-stake hours.

## 8 · Auditing

```bash
sudo apt install -y auditd lynis

sudo lynis audit system           # one-time hardening report
sudo aureport --summary           # ongoing audit summary
```

Run `lynis` once a quarter and treat the high-priority findings as a
ticket queue.

## 9 · Hosting provider hygiene

| Risk | Mitigation |
| --- | --- |
| Provider has out-of-band console access | Use a provider that supports **disk encryption with customer-managed keys** (LUKS + Tang/Clevis on bare metal; AWS KMS CMK on EC2). |
| Provider snapshots your disk | Encrypt the data volume at rest; do not store keys on it. |
| Provider terminates your instance | Have an independent, geographically separate sentry that can re-bootstrap. |
| Provider compromised | Threshold signing means even a stolen disk image cannot sign a block alone. |

## 10 · The 30-second pre-go-live checklist

```text
[ ] Validator runs as `safro`, never root
[ ] SSH: pubkey-only, no root, behind WireGuard or source-restricted
[ ] fail2ban active on sshd
[ ] Firewall: deny default; allow only sentries/signer/observability
[ ] systemd unit hardened (NoNewPrivileges, ProtectSystem, etc.)
[ ] Public IP exposes nothing (`nmap -Pn validator.example.com` is empty)
[ ] Time-sync: `chronyc tracking` shows offset < 50 ms
[ ] Consensus key NOT on the validator host (TMKMS or Horcrux)
[ ] Operator key on Ledger or in `file` keyring with strong passphrase
[ ] Encrypted off-host backup of mnemonic, signer config, node identity
[ ] unattended-upgrades enabled, manual reboots
[ ] Lynis report reviewed, criticals addressed
```

If any line is unchecked, do not put real stake on this host.
