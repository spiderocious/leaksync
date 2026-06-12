import { Text, type TextProps, type TextStyle } from 'react-native';

import { color } from '../theme/tokens';
import { family } from '../theme/fonts';

// AppText — the e-ink type scale, ported 1:1 from packages/ui app-text.tsx.
// Three families, three jobs: Literata serif for things you READ (item bodies,
// the wordmark, the pairing code), Inter for CHROME (labels, meta, buttons),
// JetBrains Mono for the RECORD (URLs, codes, timestamps).
export type AppTextVariant =
  | 'wordmark' // LeakSync, serif 15px — the product name
  | 'display' // large serif — the pairing code / hero moments
  | 'read' // item body — serif, the content she reads
  | 'body' // sans body — chrome prose
  | 'meta' // tiny sans — "Text · just now"
  | 'overline' // uppercase tracked label — "Pairing code"
  | 'mono'; // record — URLs, IDs, timestamps

const VARIANT_STYLE: Record<AppTextVariant, TextStyle> = {
  wordmark: { fontFamily: family('serifMedium'), fontSize: 15, letterSpacing: -0.15, color: color.ink },
  display: {
    fontFamily: family('serifMedium'),
    fontSize: 34,
    lineHeight: 36,
    letterSpacing: 4.8,
    color: color.ink,
  },
  read: { fontFamily: family('serif'), fontSize: 13.5, lineHeight: 21, color: color.ink },
  body: { fontFamily: family('sans'), fontSize: 13, lineHeight: 19.5, color: color.ink2 },
  meta: { fontFamily: family('sans'), fontSize: 10, letterSpacing: 0.5, color: color.ink3 },
  overline: {
    fontFamily: family('sansSemibold'),
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: color.ink3,
  },
  mono: { fontFamily: family('mono'), fontSize: 11.5, lineHeight: 17, color: color.ink2 },
};

export interface AppTextProps extends TextProps {
  variant?: AppTextVariant;
}

export function AppText({ variant = 'body', style, ...rest }: AppTextProps) {
  return <Text style={[VARIANT_STYLE[variant], style]} {...rest} />;
}
