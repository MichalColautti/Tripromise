import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts } from '../constants/theme';

export default function TextLink({ title, onPress, style, textStyle }) {
  return (
    <Pressable
      accessibilityRole="link"
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [pressed && styles.pressed, style]}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.link,
  },
  pressed: {
    opacity: 0.6,
  },
});
