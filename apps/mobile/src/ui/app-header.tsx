import { StyleSheet, View } from 'react-native';

import { color } from '../theme/tokens';
import { AppIcon } from './app-logo';
import { AppStatusDot, type AppStatusKind } from './app-status-dot';
import { AppText } from './app-text';

// AppHeader — the wordmark row used on the home/settings surfaces: the mark +
// "LeakSync" on the left, a status dot + label on the right. Mirrors the header
// in packages/ui AndroidHome.
export function AppHeader({ status = 'live' }: { status?: AppStatusKind }) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <AppIcon size={26} />
        <AppText variant="wordmark">LeakSync</AppText>
      </View>
      <View style={styles.right}>
        <AppStatusDot status={status} />
        <AppText variant="meta" style={{ textTransform: 'uppercase' }}>
          {status === 'live' ? 'Live' : status === 'reconnecting' ? 'Syncing' : 'Offline'}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  left: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 2 },
  // kept for callers that want a divider under the header
  rule: { height: 1, backgroundColor: color.hair },
});
