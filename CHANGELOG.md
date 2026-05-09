# Changelog

All notable changes to the Safrochain documentation site will be documented in
this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project aims to follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- `static/CNAME` for the docs host (`draft-docs.safrochain.com`) so static output matches the
  canonical production domain.
- Auto deploy: GitHub Actions → **GitHub Pages** (`upload-pages-artifact` +
  `deploy-pages`); one-time **Settings → Pages → Source: GitHub Actions**; see
  `DEPLOY.md`. Vercel-based deploy removed (no `VERCEL_*` secrets).
- Pro-grade Validators section: overview, key management, remote signing
  (TMKMS/Horcrux), sentry architecture, monitoring (Prometheus + Grafana),
  alerting (Alertmanager + runbooks), day-2 operations, security hardening, and
  disaster recovery.
- SEO defaults (robots, sitemap tuning, JSON-LD enrichment, canonical sync).

### Changed

- Updated bech32 prefix to `addr_safro` across docs and examples.
- Bumped mainnet recommended version to `v0.2.2` (Go 1.25.8) across chain
  registry, install guide, network endpoints, and join-mainnet runbook.
- Global fee / node defaults: **0.1 SAF per unit of gas** (`100000usaf`) including
  chain-registry fee steps, CLI examples, and testnet Keplr `gasPriceStep`.
- Documented testnet build flow as `release/v0.1.0` on Go **1.23.9**, with
  separate copy-paste install blocks for mainnet and testnet so the two Go
  toolchains are not mixed by accident.
- Reduced sidebar menu complexity; improved home/footer UX and dark theme
  readability.

### Fixed

- ESLint 9: add `eslint.config.mjs` (flat config) so `npm run lint` and CI succeed.
- Theme toggle double-click issue by enforcing a two-state dark/light toggle.
- Navigation return loading issue (SPA route metadata sync).
- Replaced em dashes in documentation where they caused parsing or style issues.

## [0.1.0] - 2026-04-27

### Added

- Initial Docusaurus documentation site for Safrochain.

