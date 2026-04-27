---
title: Monitoring (Prometheus + Grafana)
description: Production monitoring for Safrochain validators — enable CometBFT metrics, scrape with Prometheus, visualise with Grafana, and watch the right signals.
sidebar_position: 6
keywords:
  - validator monitoring
  - Prometheus
  - Grafana
  - node-exporter
  - CometBFT metrics
  - cosmos_sdk_metrics
  - missed blocks
  - latest_block_height
  - observability
  - SLO
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

A validator without monitoring is a validator that gets jailed at 3 a.m.
This page sets up a complete observability stack: **CometBFT exposes
metrics → Prometheus scrapes them → Grafana renders them**. The next page,
[Alerting & runbooks](./alerting), wires the alerting layer on top.

## What you should be measuring

| Layer | Signal | Why |
| --- | --- | --- |
| **Consensus** | `cometbft_consensus_height` | If it stops, the validator is dead |
| **Consensus** | `cometbft_consensus_validator_missed_blocks` | Pre-jail warning |
| **Consensus** | `cometbft_consensus_validator_power` | Drops to 0 → unbonded |
| **Consensus** | `cometbft_consensus_validators` | Active set membership |
| **Mempool** | `cometbft_mempool_size`, `cometbft_mempool_tx_size_bytes` | Backlog & DOS detection |
| **P2P** | `cometbft_p2p_peers` | < 3 = network partition risk |
| **State** | `cometbft_state_block_processing_time` | App slowdown / disk pressure |
| **Host** | `node_filesystem_avail_bytes` | Disk full = node crash |
| **Host** | `node_load1`, CPU, memory | Capacity planning |
| **Host** | `node_time_offset_seconds` | Clock drift > 250 ms breaks signing |
| **Process** | `process_resident_memory_bytes` | Memory leaks, GC pressure |

## 1 · Enable CometBFT metrics

Edit `~/.safrochain/config/config.toml` on the **validator** and on each
**sentry**:

```toml
[instrumentation]
prometheus = true
prometheus_listen_addr = "0.0.0.0:26660"
namespace = "cometbft"
max_open_connections = 3
```

Restart the node:

```bash
sudo systemctl restart safrochaind
```

Confirm the endpoint is up:

```bash
curl -s http://localhost:26660/metrics | head -20
# # HELP cometbft_consensus_height Height of the chain
# # TYPE cometbft_consensus_height gauge
```

## 2 · Install `node_exporter` (host metrics)

```bash
sudo useradd -rs /bin/false node_exporter
NODE_EXPORTER_VERSION=1.8.2

curl -sLO "https://github.com/prometheus/node_exporter/releases/download/v${NODE_EXPORTER_VERSION}/node_exporter-${NODE_EXPORTER_VERSION}.linux-amd64.tar.gz"
tar -xzf node_exporter-${NODE_EXPORTER_VERSION}.linux-amd64.tar.gz
sudo install -m 0755 node_exporter-${NODE_EXPORTER_VERSION}.linux-amd64/node_exporter /usr/local/bin/
```

Systemd unit at `/etc/systemd/system/node_exporter.service`:

```ini
[Unit]
Description=Prometheus Node Exporter
After=network-online.target
Wants=network-online.target

[Service]
User=node_exporter
Group=node_exporter
ExecStart=/usr/local/bin/node_exporter \
  --collector.systemd \
  --collector.processes \
  --collector.ntp \
  --collector.netdev.device-include="^(eth|ens|enp|wg)" \
  --web.listen-address=:9100
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now node_exporter
curl -s http://localhost:9100/metrics | head -10
```

## 3 · Stand up Prometheus

> Prometheus runs on a **separate observability host**, never on the
> validator. Below is a minimal Docker Compose stack on that host.

`docker-compose.yml`:

```yaml
services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./alerts.yml:/etc/prometheus/alerts.yml:ro
      - prom_data:/prometheus
    command:
      - --config.file=/etc/prometheus/prometheus.yml
      - --storage.tsdb.retention.time=30d
      - --web.enable-lifecycle
    ports:
      - "9090:9090"

  alertmanager:
    image: prom/alertmanager:latest
    restart: unless-stopped
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml:ro
    ports:
      - "9093:9093"

  grafana:
    image: grafana/grafana:latest
    restart: unless-stopped
    environment:
      GF_SECURITY_ADMIN_PASSWORD: change_me
      GF_USERS_ALLOW_SIGN_UP: "false"
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning:ro
      - ./grafana/dashboards:/var/lib/grafana/dashboards:ro
    ports:
      - "3000:3000"

volumes:
  prom_data:
  grafana_data:
```

`prometheus.yml`:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 30s
  external_labels:
    chain: safro-mainnet-1

rule_files:
  - /etc/prometheus/alerts.yml

alerting:
  alertmanagers:
    - static_configs:
        - targets: ["alertmanager:9093"]

scrape_configs:
  - job_name: cometbft
    metrics_path: /metrics
    static_configs:
      - targets:
          - validator.internal:26660
        labels: { role: validator }
      - targets:
          - sentry-1.internal:26660
          - sentry-2.internal:26660
        labels: { role: sentry }

  - job_name: node
    static_configs:
      - targets:
          - validator.internal:9100
        labels: { role: validator }
      - targets:
          - sentry-1.internal:9100
          - sentry-2.internal:9100
        labels: { role: sentry }

  - job_name: signer
    metrics_path: /metrics
    static_configs:
      - targets:
          - signer-1.internal:26660   # tmkms or horcrux
        labels: { role: signer }
```

Bring it up:

```bash
docker compose up -d
docker compose logs -f prometheus | head
```

Confirm Prometheus is reaching the validator: open
`http://<observability-host>:9090/targets` — every target should show
`UP`.

## 4 · Grafana — datasource & dashboards

Provision the datasource (`grafana/provisioning/datasources/prom.yml`):

```yaml
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
```

Auto-load dashboards
(`grafana/provisioning/dashboards/dashboards.yml`):

```yaml
apiVersion: 1
providers:
  - name: safrochain
    folder: Safrochain
    type: file
    options:
      path: /var/lib/grafana/dashboards
```

### Recommended dashboards

| Dashboard | Source | What to import |
| --- | --- | --- |
| **CometBFT validator** | Grafana.com — search "CometBFT" or "Tendermint validator" | covers height, missed blocks, peers, mempool |
| **Node Exporter Full** | Grafana ID **1860** | host CPU/memory/disk/network |
| **Cosmos SDK / Validator overview** (Safrochain custom — see below) | snippet here | KPIs in one screen |

Drop a `safro-validator.json` file into
`grafana/dashboards/`. A starting JSON skeleton with the right queries:

```json
{
  "title": "Safrochain validator overview",
  "uid": "safro-validator",
  "schemaVersion": 39,
  "panels": [
    {
      "type": "stat",
      "title": "Latest block height",
      "targets": [{ "expr": "cometbft_consensus_height{role=\"validator\"}" }]
    },
    {
      "type": "stat",
      "title": "Validator power",
      "targets": [{ "expr": "cometbft_consensus_validator_power" }]
    },
    {
      "type": "timeseries",
      "title": "Missed blocks (1h rate)",
      "targets": [{ "expr": "rate(cometbft_consensus_validator_missed_blocks[1h])" }]
    },
    {
      "type": "stat",
      "title": "P2P peers",
      "targets": [{ "expr": "cometbft_p2p_peers" }]
    },
    {
      "type": "timeseries",
      "title": "Block processing time (p95)",
      "targets": [{ "expr": "histogram_quantile(0.95, rate(cometbft_state_block_processing_time_bucket[5m]))" }]
    },
    {
      "type": "timeseries",
      "title": "Mempool size",
      "targets": [{ "expr": "cometbft_mempool_size" }]
    },
    {
      "type": "stat",
      "title": "NTP offset (ms)",
      "targets": [{ "expr": "node_ntp_offset_seconds * 1000" }]
    },
    {
      "type": "timeseries",
      "title": "Disk free %",
      "targets": [{ "expr": "100 * node_filesystem_avail_bytes{mountpoint=\"/\"} / node_filesystem_size_bytes{mountpoint=\"/\"}" }]
    }
  ]
}
```

Open Grafana at `http://<observability-host>:3000` (admin / change_me),
and you should see **Safrochain → Safrochain validator overview** with
live data.

## 5 · The seven panels every validator owner stares at

| Panel | PromQL |
| --- | --- |
| **Latest block height (validator vs chain)** | `cometbft_consensus_height{role="validator"} - on() (max(cometbft_consensus_height) by (chain))` |
| **Missed blocks (last hour)** | `increase(cometbft_consensus_validator_missed_blocks[1h])` |
| **Validator power** | `cometbft_consensus_validator_power` |
| **P2P peer count** | `cometbft_p2p_peers` |
| **Mempool depth** | `cometbft_mempool_size` |
| **Block processing p95** | `histogram_quantile(0.95, rate(cometbft_state_block_processing_time_bucket[5m]))` |
| **Disk free** | `100 * node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}` |

Pin those seven on a wall TV in the operations area and 90 % of incidents
will be visible at a glance.

## 6 · Don't forget the signer

If you run TMKMS or Horcrux, scrape **the signer** too. TMKMS exposes a
Prometheus endpoint when built with the `prometheus` feature; Horcrux
exposes one at `:26660`. The single most useful query:

```promql
rate(horcrux_consensus_signing_attempts_total[5m])
```

If signing attempts go to zero while the chain keeps producing blocks,
the signer cluster lost quorum — page the on-call **immediately**.

## 7 · Continue to alerting

Now that the metrics flow, define **what is worth waking someone up
for** in [Alerting & runbooks](./alerting).
