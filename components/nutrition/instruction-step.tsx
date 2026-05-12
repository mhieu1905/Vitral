import { StyleSheet, Text, View } from 'react-native';

import type { RecipeInstruction } from '@/constants/nutrition';
import { nutritionColors as c, nutritionFonts as f } from '@/theme/nutrition';

type Props = {
  instruction: RecipeInstruction;
  showConnector?: boolean;
};

export function InstructionStep({ instruction, showConnector }: Props) {
  const isActive = !!instruction.active;
  return (
    <View style={s.row}>
      <View style={s.indicatorCol}>
        <View style={[s.badge, isActive ? s.badgeActive : s.badgeIdle]}>
          <Text style={[s.badgeText, isActive ? s.badgeTextActive : s.badgeTextIdle]}>
            {instruction.step}
          </Text>
        </View>
        {showConnector ? <View style={s.connector} /> : null}
      </View>
      <Text style={[s.text, isActive ? s.textActive : s.textIdle]}>{instruction.text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', gap: 16 },
  indicatorCol: { alignItems: 'center' },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeActive: { backgroundColor: c.sageDark },
  badgeIdle: { backgroundColor: c.border },
  badgeText: { fontFamily: f.displayBold, fontSize: 14, lineHeight: 21 },
  badgeTextActive: { color: '#FFFFFF' },
  badgeTextIdle: { color: c.textDim },
  connector: {
    flex: 1,
    width: 2,
    backgroundColor: c.border,
    marginVertical: 8,
  },
  text: {
    flex: 1,
    fontFamily: f.display,
    fontSize: 14,
    lineHeight: 22.75,
    paddingTop: 5,
  },
  textActive: { color: c.textDark },
  textIdle: { color: c.textDim },
});
