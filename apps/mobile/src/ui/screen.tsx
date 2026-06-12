import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { color } from '../theme/tokens';

// Screen — the paper canvas every screen sits on. Warm-grey background, dark
// status-bar icons (we're a light/paper UI), safe-area aware.
export function Screen({
  children,
  style,
  center,
}: {
  children: ReactNode;
  style?: ViewStyle;
  center?: boolean;
}) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <View style={[styles.body, center && styles.center, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.paper },
  body: { flex: 1, paddingHorizontal: 22 },
  center: { alignItems: 'center', justifyContent: 'center' },
});
