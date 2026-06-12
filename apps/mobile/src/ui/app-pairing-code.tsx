import { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { color, radius } from '../theme/tokens';
import { family } from '../theme/fonts';
import { AppText } from './app-text';

// AppPairingCodeEntry — ported from packages/ui app-pairing-code.tsx (Entry
// variant). The one number the product hinges on; the phone ENTERS it once. A
// single hidden numeric TextInput captures keystrokes; the six cells below are
// the rendered presentation. Tapping anywhere focuses the input and raises the
// numeric keypad.
export interface AppPairingCodeEntryProps {
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: number;
  autoFocus?: boolean;
  disabled?: boolean;
}

export function AppPairingCodeEntry({
  value: controlled,
  onChange,
  onComplete,
  length = 6,
  autoFocus = false,
  disabled = false,
}: AppPairingCodeEntryProps) {
  const inputRef = useRef<TextInput>(null);
  const [internal, setInternal] = useState('');
  const value = controlled ?? internal;
  const [focused, setFocused] = useState(false);

  function handleChange(raw: string) {
    const next = raw.replace(/\D/g, '').slice(0, length);
    if (controlled === undefined) setInternal(next);
    onChange?.(next);
    if (next.length === length) onComplete?.(next);
  }

  const cells = Array.from({ length }, (_, i) => value[i] ?? null);
  const activeIndex = Math.min(value.length, length - 1);

  return (
    <Pressable style={styles.wrap} onPress={() => inputRef.current?.focus()}>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        maxLength={length}
        editable={!disabled}
        autoFocus={autoFocus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={styles.hiddenInput}
        caretHidden
        accessibilityLabel="Pairing code"
      />
      {cells.map((digit, i) => {
        const isActive = focused && i === activeIndex && value.length < length;
        const isFilled = digit !== null;
        return (
          <View
            key={i}
            style={[
              styles.cell,
              { borderBottomColor: isFilled ? color.ink : color.ink3 },
              isActive && styles.cellActive,
            ]}
          >
            {isFilled ? (
              <AppText variant="display" style={styles.digit}>
                {digit}
              </AppText>
            ) : (
              <AppText variant="display" style={[styles.digit, { color: color.ink4 }]}>
                —
              </AppText>
            )}
          </View>
        );
      })}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  hiddenInput: { position: 'absolute', width: 1, height: 1, opacity: 0 },
  cell: {
    width: 44,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: color.hair,
    borderBottomWidth: 1.5,
    borderRadius: radius.card,
    backgroundColor: color.sheet,
  },
  cellActive: { borderBottomWidth: 2, borderBottomColor: color.moss },
  digit: { fontSize: 30, letterSpacing: 0 },
});
