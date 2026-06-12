# Bundled fonts (optional)

The e-ink design system uses **Literata** (serif), **Inter** (sans), and
**JetBrains Mono** (mono). The `@fontsource/*` packages in the repo only ship
`.woff/.woff2`, which **React Native cannot load** — RN needs `.ttf`/`.otf`.

The app runs fine without these files: it falls back to the platform serif /
sans / mono faces (see `src/theme/fonts.ts`). To get pixel-faithful typography
matching the web design system, drop these TTFs here:

```
Literata-Regular.ttf
Literata-Medium.ttf
Inter-Regular.ttf
Inter-Medium.ttf
Inter-SemiBold.ttf
JetBrainsMono-Regular.ttf
```

Sources (download the **TTF** static weights):
- Literata — https://fonts.google.com/specimen/Literata
- Inter — https://fonts.google.com/specimen/Inter
- JetBrains Mono — https://fonts.google.com/specimen/JetBrains+Mono

Then set `FONTS_BUNDLED = true` in `src/theme/fonts.ts` and rebuild.
