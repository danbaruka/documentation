# Changelog

All notable changes to the Safrochain documentation site will be documented in
this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project aims to follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- `static/CNAME` for the docs host (`draft-docs.safrochain.com`) so static output matches the
  canonical production domain.
- Auto deploy: GitHub Actions production job to Vercel (`vercel deploy build --prod`)
  with build artifact handoff; `vercel.json`, `scripts/deploy.sh`, `.env.example`,
  workflow display name **CI and Deploy**; one-time steps in `DEPLOY.md`.
- Pro-grade Validators section: overview, key management, remote signing
  (TMKMS/Horcrux), sentry architecture, monitoring (Prometheus + Grafana),
  alerting (Alertmanager + runbooks), day-2 operations, security hardening, and
  disaster recovery.
- SEO defaults (robots, sitemap tuning, JSON-LD enrichment, canonical sync).

### Changed

- Updated bech32 prefix to `addr_safro` across docs and examples.
- Updated recommended version to `v0.2.0` in chain registry docs.
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

