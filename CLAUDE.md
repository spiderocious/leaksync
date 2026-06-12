# LeakSync

Share anything from your Android phone to your Mac, instantly, by sharing to
LeakSync from any app's share sheet. A one-user gift build. See the PRD intent in
[docs/product/phases.md](docs/product/phases.md), [README.md](README.md) for the
workspace tour, and [docs/rules.md](docs/rules.md) for code conventions (read
`rules.md` before adding code).

This started from a reusable monorepo template; it has been rebranded
(`@repo/*` → `@leaksync/*`, root name `leaksync`) and the demo `example` feature
+ `User`/`ExampleItem` stubs have been removed. **It is an initialized project,
not a fresh template — build features directly.**

## Architecture (decided)

- **Monorepo:** this TS pnpm/Nx workspace. Backend = Express `apps/main-backend`.
- **Mac:** Electron + React (`apps/desktop`, to be added), reuses
  `@leaksync/ui` / `core` / `api`. Lives in the menu bar.
- **Android:** React Native (`apps/mobile`, to be added), registered share target.
  Shares types from `@leaksync/core`.
- **Storage:** MongoDB for item metadata; images go through the external
  file-service (`go-file-service-production.up.railway.app`) → R2. The backend
  stores only the file `key`, never image bytes.
- **Transport:** Mac opens a WebSocket on launch (hard 5-min lifetime, config-driven),
  then falls back to HTTP polling (1→2→4→8→16→20 min, doubling, cap 20); any poll
  returning a new item resets back to WebSocket. Manual Refresh always available.
  Android never holds a socket — it only POSTs. Mac registers launch-on-login.
- **Auth:** no accounts. 6-digit pairing code → long-lived per-device bearer tokens.

The `auth` and `health` backend features, the request/envelope/error middleware,
the typed `api` client, and the `ui` primitives are reusable scaffolding — keep
and build on them.

## Build phases

Work proceeds in the phases tracked in
[docs/product/phases.md](docs/product/phases.md). Pause for review after each.

## Conventions (summary — full version in docs/rules.md)

- **pnpm only** (enforced by the `preinstall` hook). Run tasks through Nx.
- Strict TypeScript; `any` is banned. Backends use NodeNext (`.js` import
  specifiers); frontends use Bundler resolution.
- Backend features follow `feature.routes.ts` / `feature.schema.ts` with a
  single `register(app)` per `features/<name>/index.ts`. Responses go through
  `ResponseUtil`; errors bubble to the central handler.
- Frontend data fetching is react-query only, hitting `EP.*` constants; routes
  come from `ROUTES.*`; UI comes from `@leaksync/ui`; icons from `@icons`.
- Package dependency direction: `core` ← `api`, `core` ← `ui`. No `ui → api`.

---

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
