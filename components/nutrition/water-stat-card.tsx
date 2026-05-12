import { StyleSheet, Text, View } from 'react-native';

import type { LucideIconType } from '@/constants/nutrition';
import { nutritionColors as c, nutritionFonts as f, waterColors as w } from '@/theme/nutrition';

type Props = {
  icon: LucideIconType;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  unit?: string;
  caption: string;
  captionTone: 'positive' | 'neutral';
};

export function WaterStatCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  unit,
  caption,
  captionTone,
}: Props) {
  return (
    <View style={s.card}>
      <View style={[s.iconBox, { backgroundColor: iconBg }]}>
        <Icon size={16} color={iconColor} strokeWidth={2} />
      </View>
      <View style={s.text}>
        <Text style={s.label}>{label}</Text>
        <View style={s.valueRow}>
          <Text style={s.value}>{value}</Text>
          {unit ? <Text style={s.unit}>{unit}</Text> : null}
        </View>
        <Text
          style={[
            s.caption,
            { color: captionTone === 'positive' ? c.sageDark : w.textHint },
          ]}
        >
          {caption}
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: w.border,
    shadowColor: c.textDark,
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1 },
  label: {
    fontFamily: f.body,
    fontSize: 10,
    color: w.textHint,
  },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 1 },
  value: {
    fontFamily: f.bodyBold,
    fontSize: 15,
    color: w.textStrong,
  },
  unit: {
    fontFamily: f.body,
    fontSize: 11,
    color: w.textHint,
  },
  caption: {
    fontFamily: f.body,
    fontSize: 10,
    marginTop: 2,
  },
});
