import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // e-ink quietude — mirrors packages/ui/src/styles.css + theme/index.ts
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
