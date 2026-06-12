import { useState } from 'react';
import { Pressable, type PressableProps, StyleSheet, View, type ViewStyle } from 'react-native';

import { color, radius } from '../theme/tokens';
import { AppText } from './app-text';

// AppButton — ported from packages/ui app-button.tsx. E-ink has almost no
// buttons. Almost every action is "tap the item"; what's left is quiet text
// actions and exactly ONE bordered button for the single deliberate moment
// (pairing). No fills, no colour, no shadow.
export type AppButtonVariant =
  | 'text' // the default — quiet
  | 'quiet' // even quieter (ink-3) — footer secondary
  | 'box' // the ONE bordered button — pairing; inverts on press
  | 'danger'; // Unpair — quiet text, NOT red (this product has no red)

export interface AppButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  variant?: AppButtonVariant;
  children: string;
  style?: ViewStyle;
  full?: boolean;
}

export function AppButton({ variant = 'text', children, style, full, disabled, ...rest }: AppButtonProps) {
  const [pressed, setPressed] = useState(false);

  const isBox = variant === 'box';
  const labelColor =
    variant === 'quiet' ? color.ink3 : variant === 'box' && pressed ? color.paper : color.ink2;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.base,
        isBox && styles.box,
        isBox && pressed && styles.boxPressed,
        full && styles.full,
        disabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      <View style={[!isBox && pressed && styles.textPressed]}>
        <AppText
          variant="body"
          style={{
            fontSize: 12,
            color: variant === 'box' && pressed ? color.paper : labelColor,
            textAlign: 'center',
          }}
        >
          {children}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  full: { alignSelf: 'stretch' },
  box: {
    borderWidth: 1,
    borderColor: color.ink,
    borderRadius: radius.card,
    paddingHorizontal: 18,
    paddingVertical: 11,
    backgroundColor: 'transparent',
  },
  boxPressed: { backgroundColor: color.ink },
  // quiet text buttons show intent with a hairline underline on press
  textPressed: { borderBottomWidth: 1, borderBottomColor: color.ink },
  disabled: { opacity: 0.4 },
});
