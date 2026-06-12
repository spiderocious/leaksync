import { useEffect, useRef, useState } from 'react';
import { Image, Keyboard, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import type { ItemKind } from '@leaksync/core';

import { AppButton, AppText, Screen } from '../src/ui';
import { useAppState } from '../src/state/app-state';
import { color } from '../src/theme/tokens';

// Compose — the two in-app ways to send without a share sheet:
//   1. Type text (a note or a pasted URL — we detect which).
//   2. Pick a photo/video from the library.
// No API yet: "Send" records the item locally and returns home. Opening with
// ?pick=1 launches the picker immediately.
type Picked = { uri: string; filename: string; kind: 'image' };

export default function ComposeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ pick?: string }>();
  const { addSent, macName } = useAppState();

  const [text, setText] = useState('');
  const [picked, setPicked] = useState<Picked | null>(null);
  const launchedRef = useRef(false);

  // If launched from the "Send a photo" action, open the library right away.
  useEffect(() => {
    if (params.pick === '1' && !launchedRef.current) {
      launchedRef.current = true;
      void pickMedia();
    }
  }, [params.pick]);

  async function pickMedia() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      quality: 1,
      selectionLimit: 1,
    });
    if (result.canceled || result.assets.length === 0) return;
    const asset = result.assets[0]!;
    setPicked({
      uri: asset.uri,
      filename: asset.fileName ?? asset.uri.split('/').pop() ?? 'Image',
      kind: 'image',
    });
  }

  const canSend = picked !== null || text.trim().length > 0;

  function handleSend() {
    if (!canSend) return;
    Keyboard.dismiss();
    if (picked) {
      addSent({ kind: 'image', content: picked.filename, uri: picked.uri });
    } else {
      const trimmed = text.trim();
      const kind: ItemKind = isUrl(trimmed) ? 'url' : 'text';
      addSent({ kind, content: trimmed });
    }
    router.replace('/');
  }

  return (
    <Screen>
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <AppText variant="body" style={{ color: color.ink3 }}>
            Cancel
          </AppText>
        </Pressable>
        <AppText variant="overline">New send</AppText>
        <View style={{ width: 48 }} />
      </View>

      <AppText variant="read" style={styles.dest}>
        to {macName}
      </AppText>

      {picked ? (
        <View style={styles.preview}>
          <Image source={{ uri: picked.uri }} style={styles.previewImg} resizeMode="cover" />
          <View style={styles.previewMeta}>
            <AppText variant="read" numberOfLines={1}>
              {picked.filename}
            </AppText>
            <Pressable onPress={() => setPicked(null)} hitSlop={8}>
              <AppText variant="meta" style={{ color: color.warn }}>
                remove
              </AppText>
            </Pressable>
          </View>
        </View>
      ) : (
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Write something, or paste a link…"
          placeholderTextColor={color.ink4}
          multiline
          autoFocus={params.pick !== '1'}
          style={styles.input}
          textAlignVertical="top"
        />
      )}

      <View style={styles.row}>
        <Pressable onPress={pickMedia} style={styles.mediaBtn} hitSlop={6}>
          <Ionicons name="image-outline" size={18} color={color.ink2} />
          <AppText variant="body" style={{ fontSize: 12 }}>
            {picked ? 'Change photo' : 'Photo or video'}
          </AppText>
        </Pressable>

        <AppButton variant="box" onPress={handleSend} disabled={!canSend}>
          Send to Mac
        </AppButton>
      </View>
    </Screen>
  );
}

function isUrl(s: string): boolean {
  return /^https?:\/\/\S+$/i.test(s) || /^www\.\S+$/i.test(s);
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  dest: { fontStyle: 'italic', color: color.ink3, fontSize: 12.5, marginTop: 6, marginBottom: 20 },
  input: {
    flex: 1,
    fontFamily: 'serif',
    fontSize: 16,
    lineHeight: 24,
    color: color.ink,
    paddingTop: 4,
  },
  preview: { flex: 1, gap: 12 },
  previewImg: {
    width: '100%',
    height: 280,
    borderRadius: 2,
    backgroundColor: color.paper3,
    borderWidth: 1,
    borderColor: color.hair,
  },
  previewMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: color.hair,
  },
  mediaBtn: { flexDirection: 'row', alignItems: 'center', gap: 7 },
});
