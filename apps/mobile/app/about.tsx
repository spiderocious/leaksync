import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppText, Screen } from '../src/ui';
import { useAppState } from '../src/state/app-state';
import { color } from '../src/theme/tokens';

// About — ported from packages/ui AboutScene. The one place the gift speaks:
// a personal note on a paper card. The note text is the gift layer (Phase 8
// will make it configurable); a warm placeholder lives here for now.
export default function AboutScreen() {
  const router = useRouter();
  const { userName } = useAppState();

  return (
    <Screen>
      <View style={styles.head}>
        <AppText variant="body" style={{ color: color.ink3 }} onPress={() => router.back()}>
          ‹ settings
        </AppText>
        <AppText variant="overline">About</AppText>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.card}>
        <AppText variant="read" style={styles.note}>
          {userName ? `${userName}, ` : ''}I built this so the little things you find on your phone
          land on your Mac without the email-yourself dance. Share to LeakSync from anywhere — it’s
          already there.
        </AppText>
        <AppText variant="read" style={styles.signature}>
          — made for you
        </AppText>
      </View>

      <AppText variant="mono" style={styles.version}>
        LEAKSYNC · 0.1.0
      </AppText>
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
  card: {
    marginTop: 26,
    borderWidth: 1,
    borderColor: color.hair,
    borderRadius: 2,
    backgroundColor: color.paper,
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  note: { fontSize: 13.5, lineHeight: 23, color: color.ink },
  signature: {
    marginTop: 16,
    textAlign: 'right',
    fontStyle: 'italic',
    fontSize: 13,
    color: color.ink3,
  },
  version: {
    marginTop: 18,
    textAlign: 'center',
    fontSize: 10,
    letterSpacing: 1,
    color: color.ink4,
    textTransform: 'uppercase',
  },
});
