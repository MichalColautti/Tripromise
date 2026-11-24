import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, spacing } from '../constants/theme';

export default function ScreenHeading({ eyebrow, title, subtitle }) {
  return (
    <View style={styles.container}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow.toUpperCase()}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  eyebrow: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    letterSpacing: 1.6,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 40,
    lineHeight: 46,
    letterSpacing: -1,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
});
