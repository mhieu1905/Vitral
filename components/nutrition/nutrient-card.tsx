import { StyleSheet, Text, View } from 'react-native';

import type { NutrientFocusData } from '@/constants/nutrition';
import { nutritionColors as c, nutritionFonts as f } from '@/theme/nutrition';

type Props = {
  data: NutrientFocusData;
};

export function NutrientCard({ data }: Props) {
  const Icon = data.Icon;
  const clamped = Math.max(0, Math.min(1, data.pct));
  return (
    <View style={[s.card, { backgroundColor: data.bgColor, borderColor: data.borderColor }]}>
      <Icon size={20} color={data.iconColor} strokeWidth={2} />
      <Text style={s.label}>{data.label}</Text>
      <View style={s.valueRow}>
        <Text style={s.value}>{data.value}</Text>
        <Text style={s.unit}>{data.unit}</Text>
      </View>
      <View style={s.barBg}>
        <View style={[s.barFill, { width: `${clamped * 100}%`, backgroundColor: data.barColor }]} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    flex: 1,
    padding: 21,
    borderRadius: 32,
    borderWidth: 1,
    gap: 12,
  },
  label: {
    fontFamily: f.displayMed,
    fontSize: 12,
    color: c.textMuted,
    letterSpacing: 0.6,
    lineHeight: 16,
  },
  valueRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  value: { fontFamily: f.displayBold, fontSize: 24, color: c.textDark, lineHeight: 32 },
  unit: { fontFamily: f.display, fontSize: 14, color: c.textMuted, lineHeight: 20, marginBottom: 4 },
  barBg: {
    height: 6,
    borderRadius: 999,
    backgroundColor: c.border,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 999 },
});
