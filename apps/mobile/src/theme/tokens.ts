// LeakSync e-ink tokens — the React Native mirror of
// packages/ui/src/styles.css. Same palette, same type families, same geometry.
// The web DS renders with Tailwind + CSS vars (DOM); RN can't use those, so we
// re-express the exact same values here as plain constants consumed by
// StyleSheet. Keep these in lockstep with styles.css.
//
// Stance: an e-reader on a bedside table. Paper, not screen — no glow, no
// gradient, no pure white or black. One muted moss accent, used at most once
// per screen.

export const color = {
  // Paper & ink — greyscale, warm-grey, no pure white/black.
  paper: '#e8e6e1', // the canvas
  paper2: '#e0ddd6', // recessed surface / pressed row
  paper3: '#d9d5cc', // deepest recess (thumb wells, skeleton)
  sheet: '#edebe6', // a raised sheet (the popup body / cards)

  ink: '#23211c', // warm near-black — primary text
  ink2: '#55524a', // body / secondary
  ink3: '#83806f', // meta, labels, tertiary
  ink4: '#a8a493', // faintest — placeholders, disabled

  hair: '#cfcbc0', // the hairline — every separator
  hairSoft: '#dad6cc', // an even quieter divider
  rule: '#23211c', // the rare heavy ink rule

  // The ONE accent — muted moss. At most once per screen, never a fill.
  moss: '#7e9466',
  mossDeep: '#61774a', // pressed/hover step (rare)
  mossFaint: '#c5cfb6', // copied-row wash (rare)

  // Status — meaning carried by text. No red anywhere.
  live: '#7e9466', // connected — the one moss use
  idle: '#a8a493', // offline — hollow grey ring
  warn: '#9a7b3a', // muted ochre — "couldn't send" only
  warnFaint: '#e6dec9',
} as const;

// Font families. These are the @fontsource faces; on RN they are loaded via
// expo-font under these exact keys (see src/theme/fonts.ts).
export const font = {
  serif: 'Literata', // the reading face — item bodies, wordmark, pairing code
  serifMedium: 'Literata-Medium',
  sans: 'Inter', // chrome — labels, meta, buttons
  sansMedium: 'Inter-Medium',
  sansSemibold: 'Inter-SemiBold',
  mono: 'JetBrainsMono', // the record — URLs, codes, timestamps
} as const;

// Geometry — flat paper, near-square corners.
export const radius = {
  sharp: 1,
  card: 2,
  pill: 9999,
} as const;

export const space = {
  gutter: 18,
} as const;

// The single allowed depth — only the floating popup/modal casts it.
export const shadow = {
  pop: {
    shadowColor: '#23211c',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 12,
  },
} as const;

export type Color = keyof typeof color;
