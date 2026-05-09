---
title: Alerting & runbooks
description: Alertmanager rules, paging integrations, and incident runbooks for Safrochain validators.
sidebar_position: 7
keywords:
  - Alertmanager
  - validator alerts
  - on-call paging
  - PagerDuty
  - Discord alerts
  - Telegram alerts
  - validator runbook
  - incident response
  - SLO
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Monitoring tells you what is happening; alerting tells you **when to act**.
This page assumes you completed [Monitoring](./monitoring): Prometheus is
scraping the validator, sentries, signer, and host metrics.

## Severity levels

| Severity | Response time | Channel | Examples |
| --- | --- | --- | --- |
| **P1: page** | < 5 min, 24/7 | PagerDuty / OpsGenie / phone | Validator stopped signing; height stalled; double-sign risk |
| **P2: wake** | < 30 min, business hours | Discord/Slack with audible ping | Missed blocks > 50/hour; peers < 3; disk < 15 % |
| **P3: ticket** | next business day | email/issue tracker | Disk < 30 %; clock drift > 100 ms; sentry behind |

A validator with **only P1** alerts will get jailed; a validator with **all
P3** alerts will burn out the operator. Tune both.

## 1 · `alerts.yml`: battle-tested rules

Drop this file at `./alerts.yml` next to your `prometheus.yml`. Reload
Prometheus with `curl -X POST http://localhost:9090/-/reload`.

```yaml
groups:
  - name: safrochain.validator
    rules:
      - alert: ValidatorJailed
        expr: cometbft_consensus_validator_power{role="validator"} == 0
        for: 2m
        labels: { severity: critical, page: "true" }
        annotations:
          summary: "Validator has 0 voting power (jailed or unbonded)"
          runbook: "https://draft-docs.safrochain.com/validators/alerting#runbook-validatorjailed"

      - alert: ValidatorMissingBlocks
        expr: increase(cometbft_consensus_validator_missed_blocks[10m]) > 5
        for: 0m
        labels: { severity: critical, page: "true" }
        annotations:
          summary: "Validator missed > 5 blocks in 10 min: pre-jail warning"
          runbook: "https://draft-docs.safrochain.com/validators/alerting#runbook-validatormissingblocks"

      - alert: ChainHeightStalled
        expr: rate(cometbft_consensus_height{role="validator"}[5m]) == 0
        for: 2m
        labels: { severity: critical, page: "true" }
        annotations:
          summary: "Validator block height has not advanced in 2 min"
          runbook: "https://draft-docs.safrochain.com/validators/alerting#runbook-chainheightstalled"

      - alert: ValidatorBehindNetwork
        expr: |
          (max(cometbft_consensus_height) by (chain))
          - on(chain) cometbft_consensus_height{role="validator"} > 5
        for: 5m
        labels: { severity: warning }
        annotations:
          summary: "Validator is more than 5 blocks behind the network tip"

      - alert: LowPeerCount
        expr: cometbft_p2p_peers{role="validator"} < 3
        for: 5m
        labels: { severity: warning }
        annotations:
          summary: "Validator has fewer than 3 P2P peers"

      - alert: SentryDown
        expr: up{job="cometbft", role="sentry"} == 0
        for: 2m
        labels: { severity: warning }
        annotations:
          summary: "Sentry {{ $labels.instance }} is unreachable"

      - alert: SignerSilent
        expr: rate(horcrux_consensus_signing_attempts_total[5m]) == 0
        for: 2m
        labels: { severity: critical, page: "true" }
        annotations:
          summary: "Remote signer has not attempted to sign in 2 min"
          runbook: "https://draft-docs.safrochain.com/validators/alerting#runbook-signersilent"

      - alert: ClockDrift
        expr: abs(node_ntp_offset_seconds) > 0.1
        for: 5m
        labels: { severity: warning }
        annotations:
          summary: "Clock on {{ $labels.instance }} drifted > 100 ms (signing risk above 250 ms)"

      - alert: DiskFillingFast
        expr: |
          predict_linear(node_filesystem_avail_bytes{mountpoint="/"}[6h], 24*3600) < 0
        for: 30m
        labels: { severity: warning }
        annotations:
          summary: "{{ $labels.instance }} disk projected to fill in 24h"

      - alert: DiskCritical
        expr: 100 * node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"} < 10
        for: 5m
        labels: { severity: critical, page: "true" }
        annotations:
          summary: "{{ $labels.instance }} disk free < 10 %"

      - alert: NodeProcessRestarted
        expr: changes(process_start_time_seconds{job="cometbft"}[10m]) > 0
        for: 0m
        labels: { severity: warning }
        annotations:
          summary: "{{ $labels.instance }} safrochaind process restarted"

      - alert: HighBlockProcessingTime
        expr: histogram_quantile(0.95, rate(cometbft_state_block_processing_time_bucket[10m])) > 2
        for: 10m
        labels: { severity: warning }
        annotations:
          summary: "Block processing p95 > 2s: node may be CPU/disk bound"
```

## 2 · `alertmanager.yml`: routing & paging

```yaml
global:
  resolve_timeout: 5m

route:
  receiver: discord-warnings
  group_by: ['alertname', 'instance']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 1h
  routes:
    - matchers: [ severity="critical", page="true" ]
      receiver: pagerduty
      continue: true
    - matchers: [ severity="critical" ]
      receiver: discord-critical

receivers:
  - name: pagerduty
    pagerduty_configs:
      - service_key: ${PAGERDUTY_SERVICE_KEY}
        description: "{{ .CommonAnnotations.summary }}"

  - name: discord-critical
    webhook_configs:
      - url: ${DISCORD_WEBHOOK_CRITICAL}
        send_resolved: true

  - name: discord-warnings
    webhook_configs:
      - url: ${DISCORD_WEBHOOK_WARNINGS}
        send_resolved: true

inhibit_rules:
  - source_matchers: [ alertname="ChainHeightStalled" ]
    target_matchers: [ alertname="ValidatorMissingBlocks" ]
    equal: [ instance ]
```

### Paging integrations: quick wiring

<Tabs groupId="paging" defaultValue="discord">
  <TabItem value="discord" label="Discord webhook">

```bash
# Server settings → Integrations → Webhooks → New Webhook
# Use the webhook URL directly in alertmanager.yml
```

  </TabItem>
  <TabItem value="telegram" label="Telegram bot">

```yaml
- name: telegram
  telegram_configs:
    - bot_token: ${TELEGRAM_BOT_TOKEN}
      chat_id: ${TELEGRAM_CHAT_ID}
      parse_mode: HTML
      message: |
        <b>[{{ .Status | toUpper }}] {{ .CommonLabels.alertname }}</b>
        {{ .CommonAnnotations.summary }}
```

  </TabItem>
  <TabItem value="pagerduty" label="PagerDuty">

```text
1. PagerDuty → Configuration → Services → New Service
2. Integration type: Prometheus
3. Copy the integration key into PAGERDUTY_SERVICE_KEY
```

  </TabItem>
  <TabItem value="opsgenie" label="OpsGenie">

```yaml
- name: opsgenie
  opsgenie_configs:
    - api_key: ${OPSGENIE_API_KEY}
      message: "{{ .CommonAnnotations.summary }}"
      priority: P1
```

  </TabItem>
</Tabs>

## 3 · Runbooks

A page without a runbook is a page that prolongs the incident. Each
critical alert above must link to a runbook. The minimum runbook set is
below: keep it short, action-first, and version-controlled.

### Runbook: `ValidatorJailed`

1. Confirm the alert: `safrochaind query staking validator $VALADDR | yq '.jailed'`.
2. Check **why**:
   - missed blocks → see runbook `ValidatorMissingBlocks` first
   - tombstoned (`tombstoned: true`) → **stop**; this is a double-sign,
     follow [Disaster recovery](./disaster-recovery#double-sign-recovery)
3. If only jailed (not tombstoned), root-cause then unjail:
   ```bash
   safrochaind tx slashing unjail \
     --from validator --keyring-backend file \
     --chain-id safrochain-1 \
     --gas auto --gas-adjustment 1.3 --gas-prices 100000usaf \
     --node https://rpc.safrochain.network:443 --yes
   ```
4. Post-incident: write a short timeline in your team channel, file a
   ticket if the cause was a software/config issue.

### Runbook: `ValidatorMissingBlocks`

1. Is the **node** reachable? `curl -fsS http://localhost:26657/status > /dev/null && echo OK`.
2. Is the **signer** alive? `journalctl -u tmkms -f` or `journalctl -u horcrux -f`.
3. Is `catching_up` true? If so the node restarted recently, let it catch up.
4. Is **peer count** low? Check sentries: `curl localhost:26657/net_info | jq '.result.n_peers'`.
5. Disk full? `df -h`: most common silent killer.
6. CPU at 100 %? `top -bn1 | head`: could be heavy mempool.
7. Restart the validator only as a **last resort** and only after step 5
   shows the signer is **not** still busy: `sudo systemctl restart safrochaind`.

### Runbook: `ChainHeightStalled`

1. Is the chain itself live? `curl -fsS https://rpc.safrochain.network/status | jq '.result.sync_info'`.
   - If the **chain** has stalled (rare): wait, check announcements.
   - If the chain is fine and **only this node** is stalled, continue.
2. Is `safrochaind` running? `systemctl status safrochaind`.
3. Disk free? `df -h /home/safro/.safrochain/data`.
4. P2P peers > 0? If 0, validator is partitioned; check sentry firewall.
5. If everything looks fine but height is stuck, restart `safrochaind`.

### Runbook: `SignerSilent`

1. Identify which signer is in use: `grep priv_validator_laddr ~/.safrochain/config/config.toml`.
2. **TMKMS:** `systemctl status tmkms` → if down, start it; if up, check
   `journalctl -u tmkms` for HSM/network errors.
3. **Horcrux:** check **all three** cosigners; if 2 of 3 are alive, the
   cluster should still be signing. If 2+ are down, you are at risk;
   restart the dead cosigners.
4. If you cannot bring the signer back within 5 minutes, **stop the
   validator** to prevent any window where a misconfigured fallback could
   sign with a different key. A jailed validator can be unjailed; a
   tombstoned one cannot.

### Runbook: `DiskCritical`

1. `du -sh ~/.safrochain/data/* | sort -h`: find the biggest consumer.
2. If `application.db` is huge, run pruning (see
   [Operations → State pruning](./operations#state-pruning)).
3. If the WAL/snapshot directory is full, you can safely remove old
   snapshots in `data/snapshots/`.
4. Never remove `priv_validator_state.json`: it is the double-sign
   safety latch.

## 4 · Test the alerts (don't trust untested alerts)

```bash
# Force a synthetic alert
curl -XPOST http://localhost:9093/api/v2/alerts -H 'Content-Type: application/json' -d '[{
  "labels": {"alertname":"SyntheticTest","severity":"critical","page":"true"},
  "annotations":{"summary":"this is a test"}
}]'
```

Confirm the page lands in **every** channel: PagerDuty, Discord, Telegram,
email. Repeat once a quarter. The week your real alert misfires is not
the week to discover the webhook expired.

## 5 · Status pages & public dashboards

Operators with public delegators usually publish a small status page so
delegators can verify uptime themselves. Two cheap options:

| Tool | Cost | Notes |
| --- | --- | --- |
| **Better Uptime / Statuspage** | low monthly | scrape one of your sentries' RPC |
| **Self-hosted Uptime Kuma** | free | Docker container, pings `/status` |

Make the status page show: chain ID, voting power, last signed height,
missed blocks (24h), and incident history.
