# LeakSync

Share anything from your Android phone to your Mac, instantly, by sharing to
LeakSync from any app's share sheet. Nx + pnpm workspace with a shared
core/api/ui layer, an Express backend, React frontends, and (to come) an Electron
Mac app and a React Native Android app. Strict TypeScript, ESLint/Prettier, and a
typed request/response envelope are wired up. See
[docs/product/phases.md](docs/product/phases.md) for the build plan.

## What's in here

```
apps/
  main-backend/   Express, public HTTP API (/api/v1/*)
  web/            Vite/React, end-user app
  admin-web/      Vite/React, operations console
  website/        Next.js, marketing site
packages/
  core/           Pure TS — types, routes, helpers (no React, no Node-only APIs)
  api/            Network client (ky), endpoint constants, react-query hooks
  ui/             React + Tailwind primitives + design tokens
docs/
  rules.md        Workspace & code conventions — read this first
  run.md          How to run, build, typecheck, lint
```

## Quick start

```bash
pnpm install
cp apps/main-backend/.env.example apps/main-backend/.env
cp apps/web/.env.example          apps/web/.env
cp apps/admin-web/.env.example    apps/admin-web/.env
cp apps/website/.env.example      apps/website/.env

# In separate terminals
pnpm -F @leaksync/main-backend dev    # http://localhost:9090
pnpm -F @leaksync/web dev             # http://localhost:5173
```

Full commands (build, production, per-app filters) are in [docs/run.md](docs/run.md).

## Project layout

This started from a generic monorepo template and has been rebranded to LeakSync.
The shared design tokens live in
[packages/ui/src/theme/index.ts](packages/ui/src/theme/index.ts) (mirrored into
each app's `tailwind.config.ts` and
[packages/ui/src/styles.css](packages/ui/src/styles.css)); the design system is
built out in Phase 3. The full build plan — backend, Electron Mac app, React
Native Android share target — is in
[docs/product/phases.md](docs/product/phases.md).

## Conventions

Read [docs/rules.md](docs/rules.md) before adding code — it covers the package
dependency rules, the backend feature/envelope/error pattern, the frontend
data-fetching pattern, naming, and the strict-TypeScript settings.

## Tooling

- **pnpm** is enforced (`preinstall` hook blocks npm/yarn).
- **`.npmrc`** sets `minimum-release-age=10080` — pnpm refuses any dependency
  version published in the last 7 days, a cheap defence against fresh
  supply-chain attacks.
- **Nx** orchestrates builds in dependency order with caching. Prefer
  `nx run` / `nx run-many` / `nx affected` over the underlying tooling.
