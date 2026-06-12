# Running the workspace

The workspace is a pnpm + Nx monorepo. Every app lives under `apps/`; every shared library lives under `packages/`. Use `pnpm` for everything — `npm` and `yarn` are blocked by the root `preinstall` hook.

## Prerequisites

- Node.js **>= 20**
- pnpm **>= 9.15** (`brew install pnpm` or `corepack enable && corepack prepare pnpm@9.15.9 --activate`)
- Ports free locally: **9090** (main-backend), **5173** (web), **5174** (admin-web), **3000** (website), **4173/4174** (vite preview)

## First-time setup

```bash
pnpm install                                      # workspace install (root)
cp apps/main-backend/.env.example  apps/main-backend/.env
cp apps/web/.env.example           apps/web/.env
cp apps/admin-web/.env.example     apps/admin-web/.env
cp apps/website/.env.example       apps/website/.env
```

Set real secrets in every `.env` before running in any non-local environment. JWT secrets must be ≥ 32 chars.

## Apps overview

| App            | Stack      | Dev port | Prod cmd               | Notes                          |
| -------------- | ---------- | -------- | ---------------------- | ------------------------------ |
| `main-backend` | Express    | 9090     | `pnpm start`           | Public HTTP API (`/api/v1/*`)  |
| `web`          | Vite/React | 5173     | `pnpm start` (preview) | End-user app                   |
| `admin-web`    | Vite/React | 5174     | `pnpm start` (preview) | Operations console             |
| `website`      | Next.js    | 3000     | `pnpm start`           | Marketing / public website     |

## Running one app

Either use the per-app filter or `cd` into the app:

```bash
# Filter form (run from anywhere)
pnpm -F @leaksync/main-backend dev
pnpm -F @leaksync/web dev
pnpm -F @leaksync/admin-web dev
pnpm -F @leaksync/website dev

# Or via Nx target name (project name = unscoped, e.g. `web`)
pnpm exec nx run main-backend:dev
pnpm exec nx run web:dev
```

### Typical local stack

In separate terminals:

```bash
pnpm -F @leaksync/main-backend dev        # 9090
pnpm -F @leaksync/web dev                 # 5173 → calls main-backend
pnpm -F @leaksync/website dev             # 3000 → links to web
```

## Portless / pdev — stable `*.leaksync.localhost` URLs

[Portless](https://portless.sh) gives every app a stable HTTPS subdomain instead
of a fixed port, so apps never fight over ports. Each app has a `pdev` Nx target
alongside `dev`. Portless assigns a free port via `PORT` and serves the app over
HTTPS at its subdomain.

| App            | Portless URL                        | `pdev` target           |
| -------------- | ----------------------------------- | ----------------------- |
| `web`          | https://web.leaksync.localhost      | `nx run web:pdev`         |
| `admin-web`    | https://admin.leaksync.localhost    | `nx run admin-web:pdev`   |
| `website`      | https://www.leaksync.localhost      | `nx run website:pdev`     |
| `main-backend` | https://api.leaksync.localhost      | `nx run main-backend:pdev`|

```bash
nx run web:pdev          # one app
pnpm pdev                # all apps (nx run-many -t pdev)
```

**Requirements:** Portless needs **Node ≥ 24**. The plain `dev` targets still
work on the repo's Node ≥ 20 floor. The subdomain base is defined in
`portless.json` at the repo root; the names also appear in each
`apps/*/project.json` `pdev` command (see the rebrand note in `CLAUDE.md`).

**First run** binds port 443 and prompts for `sudo` to trust a local CA — run it
in a foreground terminal once, not unattended.

**Cross-app API:** under portless the backend is at
`https://api.leaksync.localhost`, not `http://localhost:9090`. To point a
frontend at it for a portless session, set
`VITE_API_BASE_URL=https://api.leaksync.localhost` in that app's `.env` (see the
note in each `.env.example`). The default keeps the plain fixed-port flow working.

## Building

Each app has a `build` target that produces a `dist/` (or `.next/` for the website). pnpm dependency graph + Nx caching mean shared packages build automatically when an app needs them.

```bash
# One app
pnpm -F @leaksync/main-backend build
pnpm -F @leaksync/web build

# Everything (Nx orchestrates the dependency order: core → api/ui → apps)
pnpm exec nx run-many -t build
# or
pnpm build
```

Output locations:

- `apps/main-backend/dist/` — compiled JS (run with `node dist/server.js`)
- `apps/web/dist/` — static assets (serve any way you like; `pnpm start` runs `vite preview`)
- `apps/admin-web/dist/` — same as web
- `apps/website/.next/` — Next.js production build (run with `pnpm start`)

## Running production builds locally

```bash
# Express service
pnpm -F @leaksync/main-backend build && pnpm -F @leaksync/main-backend start

# Vite preview (production bundle on a preview server, port 4173/4174)
pnpm -F @leaksync/web build && pnpm -F @leaksync/web start
pnpm -F @leaksync/admin-web build && pnpm -F @leaksync/admin-web start

# Next.js production
pnpm -F @leaksync/website build && pnpm -F @leaksync/website start
```

## Typecheck & lint

```bash
# Single project
pnpm -F @leaksync/main-backend typecheck
pnpm -F @leaksync/web lint

# All projects
pnpm typecheck       # nx run-many -t typecheck
pnpm lint            # nx run-many -t lint
pnpm build           # nx run-many -t build
```

Nx caches results — subsequent runs without source changes finish in seconds.

## Health check

```bash
curl http://localhost:9090/api/v1/health           # main-backend
```

## Troubleshooting

- `Invalid environment variables` on boot — copy the matching `.env.example` and set every required value (zod parse error lists the missing keys).
- `EADDRINUSE` — a previous dev process is still running on the port. `lsof -ti:<port> | xargs kill -9`.
- `Module not found: '@leaksync/ui'` after a rename — restart the dev server; tsconfig path edits aren't watched.
- `npm install` errors out — the `preinstall` hook blocks anything other than pnpm. Install pnpm or use corepack.
