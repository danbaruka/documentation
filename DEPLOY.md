# GitHub deploy (Vercel)

This repo deploys the docs site to **Vercel** on every successful push to
`main` using GitHub Actions. Follow this once to wire secrets and avoid double
production deploys.

## One-time setup

### 1. Vercel project

Create a project in [Vercel](https://vercel.com) that points at this
repository (or an empty project you link later). Note:

- **Team / Org ID** (sometimes called “Scope”): Project → **Settings** →
  **General**
- **Project ID**: same page, **Project ID**

### 2. Vercel token

Vercel → **Account** → **Settings** → **Tokens** → create a token with a name
like `github-actions-safrochain-docs`. Copy it once; you will not see it again.

### 3. GitHub repository secrets

In GitHub: **Settings** → **Secrets and variables** → **Actions** → **New
repository secret** for each of:

| Name | Value |
| --- | --- |
| `VERCEL_TOKEN` | The token from step 2 |
| `VERCEL_ORG_ID` | Team / Org ID from step 1 |
| `VERCEL_PROJECT_ID` | Project ID from step 1 |

These are read by the **Deploy to Vercel (production)** job in
[`.github/workflows/ci.yml`](.github/workflows/ci.yml).

### 4. Production environment (optional)

The workflow uses GitHub **Environment** `production` and URL
`https://docs.safrochain.com`. GitHub creates the environment on first run.

To require approval before a deploy, use **Environments** → `production` →
**Required reviewers** or **Deployment branches**.

## How deploy runs

| Event | What happens |
| --- | --- |
| Pull request | Typecheck, lint, and build. **No** production deploy. |
| Push to `main` | Build + upload `build/` artifact, then Vercel production deploy. |
| **Run workflow** on `main` | Same as push: full build, then deploy (manual re-release). |

Open **Actions** in GitHub; the workflow name is **CI and Deploy**. A failed
**Deploy to Vercel** step is almost always a bad or missing secret.

## Avoid two production deploys

If the repo is also connected in the Vercel UI with **automatic production
deploys** for `main`, every push can trigger **two** production deploys. Choose
one:

- **GitHub Actions only:** In Vercel, disable automatic production deploy for
  this project’s production branch, **or**
- **Vercel only:** Remove the `deploy` job from `ci.yml` and rely on Vercel’s
  Git integration.

## Local deploy (same as CI)

With the same three variables in your environment:

```bash
npm run deploy
```

See also [`.env.example`](.env.example) and [`README.md`](./README.md).
