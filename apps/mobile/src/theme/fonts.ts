import { Platform } from 'react-native';

// Font loading for the e-ink type system.
//
// The web DS uses Literata / Inter / JetBrains Mono via @fontsource. Those
// packages ship only .woff/.woff2, which React Native cannot load — RN needs
// .ttf/.otf. So this app loads TTFs from ./assets/fonts/ IF they are present,
// and otherwise falls back to the closest platform faces. The app is fully
// functional either way; dropping the TTFs in upgrades the typography to match
// the web DS exactly.
//
// To get pixel-faithful type, place these files in apps/mobile/assets/fonts/:
//   Literata-Regular.ttf, Literata-Medium.ttf
//   Inter-Regular.ttf, Inter-Medium.ttf, Inter-SemiBold.ttf
//   JetBrainsMono-Regular.ttf
// (Download from fonts.google.com / the upstream repos — TTF format.)
// Then flip FONTS_BUNDLED to true.

export const FONTS_BUNDLED = false;

// The expo-font map. Metro statically resolves every require() — even inside a
// dead branch — so we must NOT reference the TTFs here until they actually
// exist, or bundling fails. When you add the TTFs to ./assets/fonts/, set
// FONTS_BUNDLED = true and uncomment the block below (and the family() switch).
export function getFontMap(): Record<string, number> {
  if (!FONTS_BUNDLED) return {};
  // return {
  //   Literata: require('../../assets/fonts/Literata-Regular.ttf'),
  //   'Literata-Medium': require('../../assets/fonts/Literata-Medium.ttf'),
  //   Inter: require('../../assets/fonts/Inter-Regular.ttf'),
  //   'Inter-Medium': require('../../assets/fonts/Inter-Medium.ttf'),
  //   'Inter-SemiBold': require('../../assets/fonts/Inter-SemiBold.ttf'),
  //   JetBrainsMono: require('../../assets/fonts/JetBrainsMono-Regular.ttf'),
  // };
  return {};
}

// Resolve a logical font family to the actual family name to pass to RN.
// When the bundled TTFs are absent, fall back to the platform's serif / sans /
// mono so the layout and weights still read correctly.
const FALLBACK = {
  serif: Platform.select({ android: 'serif', default: 'serif' })!,
  sans: Platform.select({ android: 'sans-serif', default: 'System' })!,
  sansMedium: Platform.select({ android: 'sans-serif-medium', default: 'System' })!,
  mono: Platform.select({ android: 'monospace', default: 'Menlo' })!,
};

export function family(
  key: 'serif' | 'serifMedium' | 'sans' | 'sansMedium' | 'sansSemibold' | 'mono',
): string {
  if (FONTS_BUNDLED) {
    switch (key) {
      case 'serif':
        return 'Literata';
      case 'serifMedium':
        return 'Literata-Medium';
      case 'sans':
        return 'Inter';
      case 'sansMedium':
        return 'Inter-Medium';
      case 'sansSemibold':
        return 'Inter-SemiBold';
      case 'mono':
        return 'JetBrainsMono';
    }
  }
  switch (key) {
    case 'serif':
    case 'serifMedium':
      return FALLBACK.serif;
    case 'sans':
      return FALLBACK.sans;
    case 'sansMedium':
    case 'sansSemibold':
      return FALLBACK.sansMedium;
    case 'mono':
      return FALLBACK.mono;
  }
}
