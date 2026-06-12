import { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';

import { color, font, radius } from '../theme/tokens';
import { family } from '../theme/fonts';
import { AppText } from './app-text';

// AppItemRow — ported from packages/ui app-item-row.tsx. The one component the
// whole product is built from: every shared thing is a row — a line of serif
// text, a mono URL, or a thumbnail. On the web you drag to drop; on the phone
// (send-only) the row is mostly a record of what went out, and tapping copies
// the content back to the clipboard with the same moss "copied" feedback.
export type AppItemKind = 'text' | 'link' | 'image';

export interface AppItem {
  id: string;
  kind: AppItemKind;
  /** text body, the URL, or the image filename. */
  content: string;
  /** image thumbnail uri (kind === 'image'). */
  thumbUri?: string;
  /** relative time, e.g. "just now", "5m ago". */
  when: string;
  /** when true, the row wears the single moss tick (newest, unseen). */
  fresh?: boolean;
}

const KIND_LABEL: Record<AppItemKind, string> = { text: 'Text', link: 'Link', image: 'Image' };

export interface AppItemRowProps {
  item: AppItem;
  onCopy?: (item: AppItem) => void;
}

export function AppItemRow({ item, onCopy }: AppItemRowProps) {
  const [copied, setCopied] = useState(false);
  const [pressed, setPressed] = useState(false);

  async function handlePress() {
    await Clipboard.setStringAsync(item.content);
    setCopied(true);
    onCopy?.(item);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.row,
        item.fresh && styles.fresh,
        (pressed || copied) && styles.rowActive,
      ]}
    >
      {item.kind === 'image' ? (
        <View style={styles.imageRow}>
          <View style={styles.thumb}>
            {item.thumbUri ? (
              <Image source={{ uri: item.thumbUri }} style={styles.thumbImg} resizeMode="cover" />
            ) : null}
          </View>
          <View style={styles.imageBody}>
            <AppText variant="read" style={[{ fontSize: 12.5 }, copied && styles.copiedText]}>
              {item.content}
            </AppText>
            <Meta kind={item.kind} when={item.when} copied={copied} />
          </View>
        </View>
      ) : item.kind === 'link' ? (
        <View>
          <View style={styles.linkLine}>
            <Ionicons name="link-outline" size={13} color={color.ink2} />
            <AppText
              variant="mono"
              numberOfLines={1}
              style={[styles.linkText, copied && styles.copiedText]}
            >
              {item.content}
            </AppText>
          </View>
          <Meta kind={item.kind} when={item.when} copied={copied} />
        </View>
      ) : (
        <View>
          <AppText variant="read" numberOfLines={2} style={copied && styles.copiedText}>
            {item.content}
          </AppText>
          <Meta kind={item.kind} when={item.when} copied={copied} />
        </View>
      )}
    </Pressable>
  );
}

function Meta({ kind, when, copied }: { kind: AppItemKind; when: string; copied: boolean }) {
  return (
    <View style={styles.meta}>
      <AppText variant="meta">{KIND_LABEL[kind]} · </AppText>
      {copied ? (
        <AppText variant="meta" style={{ color: color.mossDeep, fontFamily: family('sansSemibold') }}>
          copied
        </AppText>
      ) : (
        <AppText variant="meta">{when}</AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: color.hair,
  },
  rowActive: { backgroundColor: color.paper2 },
  fresh: { borderLeftWidth: 3, borderLeftColor: color.moss, paddingLeft: 15 },
  imageRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: radius.sharp,
    backgroundColor: color.paper3,
    borderWidth: 1,
    borderColor: color.hair,
    overflow: 'hidden',
  },
  thumbImg: { width: '100%', height: '100%' },
  imageBody: { flex: 1 },
  linkLine: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  linkText: { flex: 1 },
  copiedText: {
    textDecorationLine: 'underline',
    textDecorationColor: color.moss,
  },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
});
