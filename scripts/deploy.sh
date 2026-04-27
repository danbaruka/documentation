#!/usr/bin/env bash
# Safrochain docs: production deploy to Vercel (static build from build/)
# Usage:
#   export VERCEL_TOKEN=...
#   export VERCEL_ORG_ID=team_...
#   export VERCEL_PROJECT_ID=prj_...
#   ./scripts/deploy.sh
#
# Get IDs: Vercel Project → Settings → General.
# Create token: Vercel → Account Settings → Tokens.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ -z "${VERCEL_TOKEN:-}" ]]; then
  echo "error: VERCEL_TOKEN is not set (Vercel → Account Settings → Tokens)" >&2
  exit 1
fi
if [[ -z "${VERCEL_ORG_ID:-}" ]]; then
  echo "error: VERCEL_ORG_ID is not set (Project → Settings → General → Team / Org ID)" >&2
  exit 1
fi
if [[ -z "${VERCEL_PROJECT_ID:-}" ]]; then
  echo "error: VERCEL_PROJECT_ID is not set (Project → Settings → General → Project ID)" >&2
  exit 1
fi

export VERCEL_ORG_ID
export VERCEL_PROJECT_ID

echo "==> Install (ci-style)"
npm ci

echo "==> Quality gate"
npm run typecheck
npm run lint

echo "==> Production build"
npm run build

echo "==> Deploy static output to Vercel (production)"
# Path is the Docusaurus output directory; --prod maps to your production domain
npx vercel@40.1.0 deploy build --prod --yes --token "$VERCEL_TOKEN"

echo "==> Done"
