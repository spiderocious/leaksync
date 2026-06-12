import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { ShareIntentProvider, useShareIntentContext } from 'expo-share-intent';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppStateProvider } from '../src/state/app-state';
import { getFontMap } from '../src/theme/fonts';
import { color } from '../src/theme/tokens';

// Root layout: providers (share-intent + app state) wrap the navigator. When a
// share intent arrives from another app's share sheet, we route to /share to
// show the confirmation. No API yet — the confirm screen records the item
// locally and dismisses.
export default function RootLayout() {
  const [fontsReady] = useFonts(getFontMap());

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: color.paper }}>
      <ShareIntentProvider
        options={{ debug: __DEV__, resetOnBackground: true }}
      >
        <AppStateProvider>
          <ShareIntentRouter ready={fontsReady} />
        </AppStateProvider>
      </ShareIntentProvider>
    </GestureHandlerRootView>
  );
}

function ShareIntentRouter({ ready }: { ready: boolean }) {
  const router = useRouter();
  const segments = useSegments();
  const { hasShareIntent } = useShareIntentContext();

  // When an inbound share lands, jump to the confirmation screen (unless we're
  // already there).
  useEffect(() => {
    if (hasShareIntent && segments[0] !== 'share') {
      router.replace('/share');
    }
  }, [hasShareIntent, segments, router]);

  // Wait for the (optional) bundled fonts before first paint so type doesn't
  // flash. `ready` is true immediately when no TTFs are bundled.
  if (!ready) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: color.paper },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="share" options={{ presentation: 'transparentModal', animation: 'fade' }} />
      <Stack.Screen name="compose" options={{ presentation: 'modal' }} />
      <Stack.Screen name="pair" />
      <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
      <Stack.Screen name="about" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
