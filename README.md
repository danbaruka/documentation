# Safrochain Documentation

[![Build status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](./LICENSE)
[![Made with Docusaurus](https://img.shields.io/badge/built%20with-Docusaurus-3578E5)](https://docusaurus.io)
[![Node](https://img.shields.io/badge/node-%E2%89%A520-43853d)](#)
[![Discord](https://img.shields.io/badge/community-discord-5865F2)](https://discord.gg/safrochain)

The official documentation for **Safrochain** — an Africa-first Layer-1
blockchain built on the Cosmos SDK and CometBFT consensus. The site is
published at <https://docs.safrochain.com>.

> Looking for the chain itself? See
> [`Safrochain-Org/safrochain-node`](https://github.com/Safrochain-Org).
> This repository contains **only the documentation site** — markdown
> sources, design system, and the Docusaurus build config.

---

## Table of contents

- [What's in here](#whats-in-here)
- [Quick start](#quick-start)
- [Project layout](#project-layout)
- [Writing docs](#writing-docs)
- [Available scripts](#available-scripts)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Community & support](#community--support)
- [License](#license)

---

## What's in here

| Section | Path | Audience |
| --- | --- | --- |
| Introduction | `docs/intro.md`, `docs/getting-started/` | first-time visitors |
| Networks | `docs/networks/` | mainnet & testnet endpoints, chain registry |
| Run a node | `docs/run-a-node/` | node operators |
| Validators | `docs/validators/` | staking validators (incl. monitoring/Grafana, alerting, security, DR) |
| IBC & Relayers | `docs/ibc/` | relayer operators, IBC integrators |
| Developers | `docs/cli/`, `docs/modules/` | dApp developers |
| About | `docs/protocol/`, `docs/resources/` | tokenomics, governance, foundation, FAQ |

The homepage and reusable React components live in `src/`. SEO defaults
and route-level JSON-LD are in `docusaurus.config.ts` and
`src/clientModules/seo-jsonld.ts`.

## Quick start

```bash
git clone https://github.com/Safrochain-Org/docs.git safrochain-docs
cd safrochain-docs
npm install
npm start
```

Then open <http://localhost:3000>. Hot-reload is on by default — saving
a markdown file refreshes the browser.

### Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | ≥ 20 (LTS) | use `.nvmrc` with `nvm use` |
| npm | ≥ 10 | bundled with modern Node |
| git | any recent | for branching and PRs |

> Yarn / pnpm work too; the lockfile committed here is `package-lock.json`.

## Project layout

```text
.
├── docs/                       # all markdown content (sidebar order from sidebars.ts)
│   ├── intro.md
│   ├── getting-started/
│   ├── networks/
│   ├── run-a-node/
│   ├── validators/             # full validator runbook (overview → DR)
│   ├── ibc/
│   ├── cli/
│   ├── modules/
│   ├── protocol/
│   └── resources/
├── src/
│   ├── clientModules/          # SEO + JSON-LD route hooks
│   ├── components/             # custom React components used in MDX
│   ├── css/                    # design system (custom.css)
│   └── pages/                  # homepage and standalone pages
├── static/                     # static assets (favicon, robots.txt, manifest, og images)
├── sidebars.ts                 # left-hand navigation tree
├── docusaurus.config.ts        # site config: SEO, themes, plugins
├── package.json
└── tsconfig.json
```

## Writing docs

1. **Create the file** under the right section in `docs/`. File name
   becomes the URL slug (e.g. `validators/monitoring.md` →
   `/validators/monitoring`).
2. **Add frontmatter**:

   ```md
   ---
   title: Page title that appears as <h1> and <title>
   description: Two-sentence summary used in search results and social cards.
   sidebar_position: 5
   keywords:
     - keyword 1
     - keyword 2
   ---
   ```

   If `description` contains a colon, **wrap it in double quotes** so
   YAML parses correctly.

3. **Wire it into the sidebar** in `sidebars.ts`. Pages without a
   sidebar entry are not discoverable from the navigation tree.
4. **Build locally** before pushing:

   ```bash
   npm run build
   ```

   The build runs in strict mode — broken links and broken anchors
   fail the build.

### Style conventions

- Title case for `title`, sentence case for headings inside the page.
- Tabs are 2 spaces; markdown lists use `-`.
- Use ` ``` ` fenced code blocks with a language tag (`bash`, `toml`,
  `yaml`, `json`, `go`, `rust`, `text` for plain output).
- For copy-pasteable command blocks, prefer `bash` and avoid leading `$`.
- Em dashes (`—`) are intentionally avoided — use `:`, `,`, or `;`
  depending on context.
- Cross-reference internal pages with **relative paths** without `.md`,
  e.g. `[Slashing & jail](./slashing)`.
- For architecture diagrams, prefer Mermaid (`mermaid` code block) over
  ASCII when the layout is non-trivial.

### SEO checklist for every page

- [ ] `title` and `description` set in frontmatter
- [ ] `keywords` includes 4–10 relevant terms
- [ ] First paragraph is a self-contained answer to "what is this page?"
- [ ] At least one `<h2>` per major section
- [ ] All external links use `https://`
- [ ] No raw URLs in prose; use `[text](url)`

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Run dev server with hot reload at `http://localhost:3000` |
| `npm run build` | Produce a production build into `build/` (used by deploy) |
| `npm run serve` | Serve the built `build/` directory locally |
| `npm run clear` | Clear Docusaurus cache (`.docusaurus/`) |
| `npm run typecheck` | Run `tsc --noEmit` over the TypeScript sources |
| `npm run lint` | Run ESLint over `src/` and config |
| `npm run deploy` | Local production deploy: typecheck, lint, build, `vercel deploy` (see below) |
| `npm run deploy:vercel` | Deploy existing `build/` to Vercel only (assumes you already built) |

## Deployment

### Auto deploy (CI)

On every **push to `main`**, the GitHub Action **CI** (`.github/workflows/ci.yml`):

1. Installs with `npm ci`, runs `typecheck`, `lint`, and `npm run build`.
2. Uploads the `build/` folder as an artifact.
3. The **Deploy to Vercel** job downloads that artifact and runs
   `vercel deploy build --prod` with your project token.

**Required repository secrets** (Settings → Secrets and variables → Actions):

| Secret | Where to get it |
| --- | --- |
| `VERCEL_TOKEN` | Vercel: Account Settings → Tokens (create a token for CI) |
| `VERCEL_ORG_ID` | Project → Settings → General, **Team / Org ID** |
| `VERCEL_PROJECT_ID` | Project → Settings → General, **Project ID** |

Create a GitHub **Environment** named `production` (optional) if you
want required reviewers or branch rules before the deploy job runs. The
workflow already targets `environment: production` with
`https://docs.safrochain.com` as the deployment URL.

**Manual re-deploy:** Actions → **CI** → **Run workflow**, branch `main`.
That runs the same build + deploy path without a git push.

If the same repository is also connected in the Vercel dashboard with
**production deploys on `main`**, you can get two production deploys per
push. Pick one path: either turn off Vercel’s automatic production
deploy for `main`, or remove the **Deploy to Vercel** job from the
workflow and rely on Vercel Git only.

### Vercel Git (optional, previews)

You can also connect the repo in the Vercel dashboard so every pull
request gets a **preview URL**. The CI job above still runs on each PR
for typecheck, lint, and build; it does not deploy production until `main`
is updated.

### Manual deployment from your laptop

```bash
# One-shot (reads VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID)
export VERCEL_TOKEN=...
export VERCEL_ORG_ID=...
export VERCEL_PROJECT_ID=...
npm run deploy
```

Or, if you already have a good `build/`:

```bash
export VERCEL_TOKEN=...
export VERCEL_ORG_ID=...
export VERCEL_PROJECT_ID=...
npm run build
npm run deploy:vercel
```

`vercel.json` in the repo root sets install, build, and `outputDirectory`
so the Vercel **dashboard** builds stay aligned with this repo. See
`.env.example` for the variable names.

## Contributing

We welcome documentation contributions of any size — typo fixes are as
valuable as new sections. Read [`CONTRIBUTING.md`](./CONTRIBUTING.md)
before opening a PR.

By participating, you agree to abide by our
[Code of Conduct](./CODE_OF_CONDUCT.md).

To report a security issue (in the docs **or** the chain), please follow
[`SECURITY.md`](./SECURITY.md). Do not open public issues for
security problems.

## Community & support

| Channel | Link | Use for |
| --- | --- | --- |
| Discord | <https://discord.gg/safrochain> | real-time help, validator chat |
| Telegram | <https://t.me/safrochain> | community, announcements |
| X / Twitter | <https://twitter.com/safrochain> | network status, releases |
| GitHub | <https://github.com/Safrochain-Org> | code, issues, PRs |
| Email | <hello@safrochain.com> | partnerships, press |

For a structured rundown of where to ask which question, see
[`SUPPORT.md`](./SUPPORT.md).

## License

This documentation site is licensed under the
[Apache License, Version 2.0](./LICENSE). The Safrochain name and logos
are trademarks of the Safrochain Foundation; see
`docs/resources/brand-assets.md` for usage guidelines.
