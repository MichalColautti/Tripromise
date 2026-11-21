import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, fonts, spacing } from '../constants/theme';

export default function AuthLayout({ children, footer, centered = false }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.brand}>Tripromise</Text>
          <View style={[styles.content, centered && styles.centered]}>{children}</View>
          {footer ? <Text style={styles.footer}>{footer}</Text> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  brand: {
    fontFamily: fonts.semiBold,
    fontSize: 24,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  content: {
    flex: 1,
    paddingTop: 72,
  },
  centered: {
    paddingTop: 120,
  },
  footer: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
