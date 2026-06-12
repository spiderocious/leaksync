import { useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppButton, AppIcon, AppPairingCodeEntry, AppText, Screen } from '../src/ui';
import { useAppState } from '../src/state/app-state';
import { color } from '../src/theme/tokens';

// Pairing — the single deliberate moment in the whole product. Enter the
// 6-digit code shown on the Mac. No accounts, no passwords. (No API yet — any
// complete 6-digit code "pairs" locally so the rest of the app is reachable.)
export default function PairScreen() {
  const router = useRouter();
  const { pair, userName } = useAppState();
  const [code, setCode] = useState('');

  const complete = code.length === 6;

  function handlePair() {
    if (!complete) return;
    Keyboard.dismiss();
    pair(code);
    router.replace('/');
  }

  return (
    <Screen center>
      <View style={styles.inner}>
        <AppIcon size={56} />

        <AppText variant="display" style={styles.welcome}>
          LeakSync
        </AppText>
        <AppText variant="read" style={styles.lede}>
          Welcome{userName ? `, ${userName}` : ''}. Open LeakSync on your Mac and enter the six
          digits it shows you.
        </AppText>

        <View style={styles.codeBlock}>
          <AppText variant="overline" style={styles.codeLabel}>
            Pairing code
          </AppText>
          <AppPairingCodeEntry value={code} onChange={setCode} onComplete={handlePair} autoFocus />
        </View>

        <AppButton variant="box" onPress={handlePair} disabled={!complete} style={styles.button}>
          Pair this phone
        </AppButton>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  inner: { alignItems: 'center', width: '100%', maxWidth: 360 },
  welcome: { fontSize: 28, letterSpacing: 0.5, marginTop: 22 },
  lede: {
    textAlign: 'center',
    color: color.ink2,
    marginTop: 12,
    marginBottom: 34,
    paddingHorizontal: 12,
  },
  codeBlock: { alignItems: 'center', gap: 14, marginBottom: 34 },
  codeLabel: {},
  button: { marginTop: 4 },
});
