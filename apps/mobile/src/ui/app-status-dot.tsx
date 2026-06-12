import { View, type ViewStyle } from 'react-native';

import { color } from '../theme/tokens';

// AppStatusDot — ported from packages/ui app-status-dot.tsx. One dot tells the
// whole truth: is the Mac reachable now? `live` is the system's single use of
// moss. `idle` is a hollow grey ring (no colour — nothing's wrong, just
// resting). `reconnecting` is a faded grey dot (the web does a refresh-blink;
// here we keep it static and quiet).
export type AppStatusKind = 'live' | 'idle' | 'reconnecting';

export interface AppStatusDotProps {
  status?: AppStatusKind;
  size?: number;
  style?: ViewStyle;
}

export function AppStatusDot({ status = 'live', size = 7, style }: AppStatusDotProps) {
  const base: ViewStyle = { width: size, height: size, borderRadius: size / 2 };

  if (status === 'live') {
    return <View style={[base, { backgroundColor: color.moss }, style]} />;
  }
  if (status === 'reconnecting') {
    return <View style={[base, { backgroundColor: color.idle, opacity: 0.5 }, style]} />;
  }
  // idle — hollow grey ring
  return (
    <View
      style={[base, { backgroundColor: 'transparent', borderWidth: 1, borderColor: color.idle }, style]}
    />
  );
}
