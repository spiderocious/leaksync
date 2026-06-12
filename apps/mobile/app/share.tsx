import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useShareIntentContext } from 'expo-share-intent';

import type { ItemKind } from '@leaksync/core';

import { AppStatusDot, AppText } from '../src/ui';
import { useAppState } from '../src/state/app-state';
import { color } from '../src/theme/tokens';

// Share confirmation — the 95% case, and the whole point of the product. The
// user tapped "LeakSync" in another app's share sheet; this screen reads the
// shared payload, records it, shows a quiet "Sent to your Mac ✓", and dismisses
// itself. No API yet — recording is local; the POST drops in here later.
type Phase = 'sending' | 'sent' | 'empty';

export default function ShareScreen() {
  const router = useRouter();
  const { shareIntent, hasShareIntent, resetShareIntent } = useShareIntentContext();
  const { addSent, paired } = useAppState();
  const [phase, setPhase] = useState<Phase>('sending');
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    if (!hasShareIntent) {
      setPhase('empty');
      return;
    }
    handled.current = true;

    const parsed = parseIntent(shareIntent);
    if (!parsed) {
      setPhase('empty');
    } else if (!paired) {
      // Can't send until paired — bounce to pairing, keep the intent.
      router.replace('/pair');
      return;
    } else {
      addSent(parsed);
      setPhase('sent');
    }

    // Dismiss after a beat — the user never really "enters" the app.
    const t = setTimeout(() => {
      resetShareIntent();
      router.replace('/');
    }, 1400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasShareIntent]);

  return (
    <View style={styles.backdrop}>
      <View style={styles.sheet}>
        {phase === 'sent' ? (
          <>
            <AppStatusDot status="live" size={11} style={{ marginBottom: 14 }} />
            <AppText variant="read" style={styles.title}>
              Sent to your Mac
            </AppText>
            <AppText variant="read" style={styles.sub}>
              it’s already there
            </AppText>
          </>
        ) : phase === 'sending' ? (
          <AppText variant="read" style={styles.sub}>
            Sending…
          </AppText>
        ) : (
          <AppText variant="read" style={styles.sub}>
            Nothing to send.
          </AppText>
        )}
      </View>
    </View>
  );
}

// Map an expo-share-intent payload to a local SentItem shape.
function parseIntent(
  intent: ReturnType<typeof useShareIntentContext>['shareIntent'],
): { kind: ItemKind; content: string; uri?: string } | null {
  if (!intent) return null;

  // A shared image/video (files[]).
  const file = intent.files?.[0];
  if (file && /^image\//.test(file.mimeType)) {
    return { kind: 'image', content: file.fileName ?? 'Image', uri: file.path };
  }
  if (file && /^video\//.test(file.mimeType)) {
    return { kind: 'image', content: file.fileName ?? 'Video', uri: file.path };
  }

  // A shared URL.
  if (intent.webUrl) {
    return { kind: 'url', content: intent.webUrl };
  }

  // Plain text — detect a bare URL inside it.
  if (intent.text) {
    const t = intent.text.trim();
    const kind: ItemKind = /^https?:\/\/\S+$/i.test(t) ? 'url' : 'text';
    return { kind, content: t };
  }

  return null;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(35,33,28,0.18)',
    paddingHorizontal: 40,
  },
  sheet: {
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: 30,
    paddingHorizontal: 22,
    borderRadius: 4,
    backgroundColor: color.sheet,
    borderWidth: 1,
    borderColor: color.hair,
    shadowColor: '#23211c',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 12,
  },
  title: { fontSize: 18, color: color.ink },
  sub: { fontSize: 12, fontStyle: 'italic', color: color.ink3, marginTop: 2 },
});
