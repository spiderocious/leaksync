import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { formatRelative } from '@leaksync/core';

import { AppHeader, AppItemRow, AppText, Screen, type AppItem } from '../src/ui';
import { useAppState, type SentItem } from '../src/state/app-state';
import { color } from '../src/theme/tokens';

export default function HomeScreen() {
  const router = useRouter();
  const { paired, macName, sent } = useAppState();

  if (!paired) return <Redirect href="/pair" />;

  const items = useMemo<AppItem[]>(() => sent.map(toAppItem), [sent]);

  return (
    <Screen>
      <View style={styles.top}>
        <AppHeader status="live" />
        <Pressable onPress={() => router.push('/settings')} hitSlop={10}>
          <Ionicons name="ellipsis-horizontal" size={18} color={color.ink3} />
        </Pressable>
      </View>

      <AppText variant="read" style={styles.pairedWith}>
        Paired with {macName}
      </AppText>

      <View style={styles.actions}>
        <ActionCard
          icon="create-outline"
          label="Write text"
          hint="Type something to send"
          onPress={() => router.push('/compose')}
        />
        <ActionCard
          icon="image-outline"
          label="Send a photo"
          hint="Pick from your library"
          onPress={() => router.push({ pathname: '/compose', params: { pick: '1' } })}
        />
      </View>

      <AppText variant="overline" style={styles.sectionLabel}>
        Recently sent
      </AppText>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <AppText variant="read" style={{ color: color.ink3, fontStyle: 'italic' }}>
            Nothing yet. Share to LeakSync from any app, or write something above.
          </AppText>
        </View>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={styles.listInner}>
          {items.map((item) => (
            <AppItemRow key={item.id} item={item} />
          ))}
        </ScrollView>
      )}
    </Screen>
  );
}

function ActionCard({
  icon,
  label,
  hint,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  hint: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <Ionicons name={icon} size={20} color={color.ink2} />
      <AppText variant="read" style={styles.cardLabel}>
        {label}
      </AppText>
      <AppText variant="meta">{hint}</AppText>
    </Pressable>
  );
}

function toAppItem(s: SentItem): AppItem {
  return {
    id: s.id,
    kind: s.kind === 'url' ? 'link' : s.kind === 'image' ? 'image' : 'text',
    content: s.kind === 'image' ? (s.content || 'Image') : s.content,
    thumbUri: s.uri,
    when: formatRelative(s.sentAt),
  };
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  pairedWith: {
    fontStyle: 'italic',
    color: color.ink3,
    fontSize: 12.5,
    marginTop: 6,
    marginBottom: 22,
  },
  actions: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: color.hair,
    borderRadius: 2,
    backgroundColor: color.sheet,
    padding: 14,
    gap: 6,
  },
  cardPressed: { backgroundColor: color.paper2 },
  cardLabel: { fontSize: 13, marginTop: 2 },
  sectionLabel: { marginBottom: 4 },
  list: { flex: 1, marginHorizontal: -22 },
  listInner: { paddingHorizontal: 22 },
  empty: { paddingVertical: 18 },
});
