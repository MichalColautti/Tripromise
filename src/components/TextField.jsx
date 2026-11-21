import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, fonts, radius, spacing } from '../constants/theme';

export default function TextField({ label, error, style, ...inputProps }) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, focused && styles.inputFocused, error && styles.inputError]}
        placeholderTextColor={colors.textMuted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    height: 58,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
