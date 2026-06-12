import { StyleSheet, View, type ViewStyle } from 'react-native';

import { color } from '../theme/tokens';

// AppLogo / AppIcon — ported from packages/ui app-logo.tsx. The brand mark is a
// "stack" glyph: three stacked rounded bars (the SVG on web; three Views here,
// visually identical). The Android app icon is ink-on-paper, ringed in moss.

function StackGlyph({ size = 24, barColor = color.ink }: { size?: number; barColor?: string }) {
  const unit = size / 24; // the web glyph is drawn in a 24px viewBox
  const bar = (top: number, left: number, width: number, height: number): ViewStyle => ({
    position: 'absolute',
    top: top * unit,
    left: left * unit,
    width: width * unit,
    height: height * unit,
    borderRadius: 1.2 * unit,
    borderWidth: 1.6 * unit,
    borderColor: barColor,
  });
  return (
    <View style={{ width: size, height: size }}>
      <View style={bar(5, 4, 16, 4)} />
      <View style={bar(11, 4, 16, 4)} />
      <View style={bar(17, 6, 12, 3)} />
    </View>
  );
}

export function AppLogo({ size = 24 }: { size?: number }) {
  return <StackGlyph size={size} barColor={color.ink} />;
}

export function AppIcon({ size = 52 }: { size?: number }) {
  return (
    <View style={[styles.icon, { width: size, height: size }]}>
      <StackGlyph size={Math.round(size / 2)} barColor={color.paper} />
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: color.ink,
    borderWidth: 2,
    borderColor: color.moss,
  },
});
