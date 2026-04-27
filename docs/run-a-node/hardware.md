---
title: Hardware requirements
description: CPU, RAM, disk, and network sizing per Safrochain node role.
sidebar_position: 3
---

Safrochain nodes have very different sizing depending on their role. Treat
the numbers below as **minimums**; CPU and disk should grow with chain age
and traffic.

## Per-role baselines

| Role | CPU | RAM | Disk | Network | Pruning |
| --- | --- | --- | --- | --- | --- |
| Validator | 4 vCPU dedicated | 8 GB | 200 GB NVMe | 100 Mbps, low-latency to peers and remote signer | `default` |
| Sentry / public seed | 4 vCPU | 8 GB | 200 GB NVMe | 1 Gbps, public-facing | `default` |
| Public RPC (pruned) | 4 vCPU | 16 GB | 500 GB NVMe | 1 Gbps | `default` |
| Public RPC (archive) | 8 vCPU | 32 GB | 2 TB NVMe (grows ~50 GB / month) | 1 Gbps | `nothing` |
| Remote signer / cosigner | 2 vCPU | 4 GB | 50 GB NVMe | 50 Mbps to validator + other cosigners | n/a |

## Pruning explained

Pruning controls how much application state and how many block bodies the
node keeps on disk:

| Strategy | Behaviour | Disk impact |
| --- | --- | --- |
| `nothing` | keeps **everything** (archive node) | full history; grows forever |
| `default` | keeps the most recent ~362 880 states + last 100 blocks | ~200 GB after 1 year |
| `everything` | keeps only the last 2 states + 2 blocks | tiny; useless for most queries |
| `custom` | precise control over `pruning-keep-recent`, `pruning-interval` | tune as needed |

A typical mainnet config:

```toml
# config/app.toml

pruning             = "default"
pruning-keep-recent = "100"
pruning-interval    = "10"
```

For an archive node:

```toml
pruning = "nothing"
```

## State sizes (rules of thumb)

The Safrochain mainnet has not launched yet, so these are projections from
similar Cosmos SDK 0.50 chains:

- ~5 GB after 1M blocks (year 1)
- ~50–80 GB after 10M blocks (year 3)
- archive grows ~50 GB / month at steady traffic

Plan for **3× headroom** on disk so a snapshot copy fits beside the live
data dir during catch-up.

## Network

- **Validator → remote signer**: ≤ 50 ms RTT (else signing margin shrinks).
- **Validator → sentry**: ≤ 30 ms RTT.
- **Sentry → public peers**: as good as your hosting provider.
- Avoid running validators behind aggressive shared-hosting rate limits;
  signing one block/s while the kernel sheds packets is the fastest way to
  miss blocks.

## File descriptors and ulimits

CometBFT P2P opens many sockets. Set:

```bash
# /etc/security/limits.d/safrochain.conf
safrochain soft nofile 65535
safrochain hard nofile 1048576
```

systemd users:

```ini
# /etc/systemd/system/safrochaind.service.d/limits.conf
[Service]
LimitNOFILE=1048576
```

## Recommended cloud sizes

| Provider | Validator | Sentry | RPC default | RPC archive |
| --- | --- | --- | --- | --- |
| AWS | `c7i.xlarge` + 200 GB gp3 | `c7i.xlarge` + 200 GB gp3 | `m7i.xlarge` + 500 GB gp3 | `m7i.2xlarge` + 2 TB gp3 |
| GCP | `n2-standard-4` + 200 GB pd-ssd | `n2-standard-4` + 200 GB pd-ssd | `n2-standard-4` + 500 GB pd-ssd | `n2-standard-8` + 2 TB pd-ssd |
| Hetzner | `CCX13` + 200 GB | `CCX13` + 200 GB | `CCX23` + 500 GB | `CCX33` + 2 TB |
| OVH bare metal | `Advance-1` (Ryzen 5) + NVMe | `Advance-1` | `Advance-2` (Ryzen 7) | `Infra-1` |

Bare metal is a noticeable win for validators because the NVMe latency vs
CPU jitter is more deterministic than virtualised IO.

## When in doubt

Spin up a local testnet on a development workstation
([Run a Node → Local testnet](./local-testnet)), watch peak CPU, RAM, and
disk I/O during a few hours of normal block production, and provision your
real node with **2×** those resources.
