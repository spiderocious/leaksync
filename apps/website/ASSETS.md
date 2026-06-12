# LeakSync landing page — asset manifest

Locked direction: **B5 · Pop XL** (Soft-3D Friendly Clay archetype, candy sub-variant).
The page is deliberately type-and-color driven, so the asset footprint is small.
Every slot below currently ships with a tasteful placeholder; swap when real
assets exist.

| # | Slot | Spec | Status | Routes to fill it |
|---|------|------|--------|-------------------|
| 1 | App icon / logo mark | SVG or 512px PNG, the LeakSync mark (`AppIcon` in `@leaksync/ui` is the in-app source of truth) | **Placeholder** — wordmark text in nav/footer | Provide-your-own: export from `packages/ui/src/brand/`; or generate: "flat app icon, paper #fff6e9 background, ink rounded square, single cobalt #2b50c8 stacked-sheets glyph, friendly, 2px corner radius" |
| 2 | Ding notification visual | Real macOS notification screenshot, ~720px wide, over the dark card | **Placeholder** — CSS-built notification card (looks intentional, can ship) | Provide-your-own: screenshot the Electron app notification on macOS; crop tight with 24px padding |
| 3 | Menu-bar popup screenshot | Real `MenuBarPopup` capture, 360×480 @2x | **Not used yet** — optional proof section if added later | Provide-your-own: run `apps/desktop`, populate 5 items, screenshot |
| 4 | OG / social image | 1200×630 PNG, headline + chips on #fff6e9 | **Missing** — no `opengraph-image` yet | Generate from the hero design, or screenshot the hero at 1200×630 |
| 5 | Favicon | 32px + 180px (apple-touch) | **Missing** | Derive from slot 1 |
| 6 | Download links | Real URLs for the Mac `.dmg` (Apple Silicon + Intel) and Android `.apk` | **Env-driven** — `/download` reads `NEXT_PUBLIC_DOWNLOAD_MAC_SILICON_URL`, `NEXT_PUBLIC_DOWNLOAD_MAC_INTEL_URL`, `NEXT_PUBLIC_DOWNLOAD_ANDROID_URL`; unset values render "Coming soon" | Set the env vars after Phase 9 (packaging) ships artifacts |

Notes:
- The hero needs no imagery by design (word-chips are typographic).
- Marquee rows are emoji + text; no assets required.
- Copy that was invented and should be verified: none — all claims (<1s, 6-digit
  code, 24h TTL, no accounts, one-way v1) come from the PRD and phases doc.
