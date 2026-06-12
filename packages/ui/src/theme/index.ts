// Design tokens — the TypeScript mirror of packages/ui/src/styles.css.
// The CSS vars in styles.css are the runtime source of truth; this object
// exists for code that needs token values in TS (and for the apps' tailwind
// configs to import). Stance: e-ink quietude — paper-grey, warm sumi ink, one
// muted moss accent used at most once per screen. No critical-red.
export const COLORS = {
  // Paper & ink — greyscale, warm-grey, no pure white or black.
  paper: {
    DEFAULT: '#e8e6e1',
    2: '#e0ddd6',
    3: '#d9d5cc',
    sheet: '#edebe6',
  },
  ink: {
    DEFAULT: '#23211c',
    2: '#55524a',
    3: '#83806f',
    4: '#a8a493',
  },
  hair: {
    DEFAULT: '#cfcbc0',
    soft: '#dad6cc',
  },
  // The one accent — muted moss. Never a fill; at most one use per screen.
  moss: {
    DEFAULT: '#7e9466',
    deep: '#61774a',
    faint: '#c5cfb6',
  },
  // Status — meaning carried by text. No red anywhere.
  idle: '#a8a493',
  warn: {
    DEFAULT: '#9a7b3a',
    faint: '#e6dec9',
  },
} as const;

export type ColorScale = keyof typeof COLORS;

export const FONTS = {
  serif: '"Literata", "Newsreader", Georgia, serif', // the reading face
  sans: '"Inter", system-ui, sans-serif', // chrome
  mono: '"JetBrains Mono", ui-monospace, monospace', // record
} as const;
