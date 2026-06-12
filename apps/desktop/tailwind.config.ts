import type { Config } from 'tailwindcss';

// Mirrors apps/web/tailwind.config.ts — e-ink tokens for the @leaksync/ui
// classes the renderer uses.
export default {
  content: ['./src/renderer/**/*.{ts,tsx,html}', '../../packages/ui/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: '#e8e6e1', 2: '#e0ddd6', 3: '#d9d5cc', sheet: '#edebe6' },
        ink: { DEFAULT: '#23211c', 2: '#55524a', 3: '#83806f', 4: '#a8a493' },
        hair: { DEFAULT: '#cfcbc0', soft: '#dad6cc' },
        moss: { DEFAULT: '#7e9466', deep: '#61774a', faint: '#c5cfb6' },
        idle: '#a8a493',
        warn: { DEFAULT: '#9a7b3a', faint: '#e6dec9' },
      },
      fontFamily: {
        serif: ['Literata', 'Newsreader', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: { sharp: '1px', card: '2px' },
    },
  },
  plugins: [],
} satisfies Config;
