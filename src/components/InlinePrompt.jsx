import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, spacing } from '../constants/theme';
import TextLink from './TextLink';

export default function InlinePrompt({ text, linkTitle, onPress }) {
  return (
    <View style={styles.row}>
      <Text style={styles.text}>{text} </Text>
      <TextLink title={linkTitle} onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  text: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
  },
});
