import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppButton, AppText, Screen } from '../src/ui';
import { useAppState } from '../src/state/app-state';
import { color, font } from '../src/theme/tokens';
import { family } from '../src/theme/fonts';

// Settings — ported from packages/ui SettingsScene. There is exactly one
// setting (unpair) and a link to the About page that holds the personal note.
// The screen's job is to be honest about how little there is.
export default function SettingsScreen() {
  const router = useRouter();
  const { macName, unpair } = useAppState();

  const rows: { key: string; value: string }[] = [
    { key: 'Paired with', value: macName },
    { key: 'Direction', value: 'Phone → Mac' },
    { key: 'Version', value: '0.1.0' },
  ];

  function handleUnpair() {
    unpair();
    router.replace('/pair');
  }

  return (
    <Screen>
      <View style={styles.head}>
        <AppText variant="body" style={{ color: color.ink3 }} onPress={() => router.back()}>
          ‹ back
        </AppText>
        <AppText variant="overline">Settings</AppText>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.rows}>
        {rows.map((row, i) => (
          <View key={row.key} style={[styles.row, i === rows.length - 1 && styles.rowLast]}>
            <AppText variant="read" style={{ fontSize: 13.5 }}>
              {row.key}
            </AppText>
            <AppText variant="mono" style={styles.rowValue}>
              {row.value}
            </AppText>
          </View>
        ))}
      </View>

      <View style={styles.links}>
        <AppButton variant="quiet" onPress={() => router.push('/about')}>
          About LeakSync
        </AppButton>
      </View>

      <View style={styles.danger}>
        <AppButton variant="danger" onPress={handleUnpair}>
          Unpair this device
        </AppButton>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: color.hair,
  },
  rows: { marginTop: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: color.hair,
  },
  rowLast: { borderBottomWidth: 0 },
  rowValue: { color: color.ink3, fontSize: 11, letterSpacing: 0.4 },
  links: { marginTop: 22, alignItems: 'center', borderTopWidth: 1, borderTopColor: color.hair, paddingTop: 18 },
  danger: { marginTop: 'auto', alignItems: 'center', paddingBottom: 8 },
});
