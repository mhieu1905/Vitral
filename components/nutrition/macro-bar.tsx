import { StyleSheet, Text, View, type TextStyle, type ViewStyle } from 'react-native';

import { nutritionColors as c, nutritionFonts as f } from '@/theme/nutrition';

type Props = {
  label: string;
  value: string;
  pct: number;
  color: string;
  labelColor?: string;
  trackColor?: string;
  height?: number;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  valueStyle?: TextStyle;
};

export function MacroBar({
  label,
  value,
  pct,
  color,
  labelColor,
  trackColor = c.border,
  height = 12,
  containerStyle,
  labelStyle,
  valueStyle,
}: Props) {
  const clamped = Math.max(0, Math.min(1, pct));
  return (
    <View style={[s.row, containerStyle]}>
      <View style={s.headerRow}>
        <Text style={[s.label, labelColor ? { color: labelColor } : null, labelStyle]}>{label}</Text>
        <Text style={[s.value, valueStyle]}>{value}</Text>
      </View>
      <View style={[s.barBg, { height, backgroundColor: trackColor }]}>
        <View style={[s.barFill, { width: `${clamped * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  row: {},
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  label: { fontFamily: f.displayMed, fontSize: 16, color: c.textDark, lineHeight: 24 },
  value: { fontFamily: f.display, fontSize: 12, color: c.textMuted, lineHeight: 16 },
  barBg: {
    marginTop: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 999 },
});
