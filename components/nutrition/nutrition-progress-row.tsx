import { StyleSheet, Text, View } from 'react-native';

import type { RecipeTagTone } from '@/constants/nutrition';
import { nutritionColors as c, nutritionFonts as f } from '@/theme/nutrition';

type Props = {
  label: string;
  pct: number;
  display: string;
  tone: RecipeTagTone;
};

const TONE_FILL: Record<RecipeTagTone, string> = {
  sage: c.sage,
  pink: c.pinkLight,
  blue: c.blueLight,
};

const TONE_TEXT: Record<RecipeTagTone, string> = {
  sage: c.sageDark,
  pink: c.pink,
  blue: c.blue,
};

export function NutritionProgressRow({ label, pct, display, tone }: Props) {
  const clamped = Math.max(0, Math.min(1, pct));
  return (
    <View style={s.row}>
      <View style={s.head}>
        <Text style={s.label}>{label}</Text>
        <Text style={[s.value, { color: TONE_TEXT[tone] }]}>{display}</Text>
      </View>
      <View style={s.track}>
        <View
          style={[
            s.fill,
            { width: `${clamped * 100}%`, backgroundColor: TONE_FILL[tone] },
          ]}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  row: { gap: 8 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontFamily: f.displayMed, fontSize: 14, color: c.textDark, lineHeight: 21 },
  value: { fontFamily: f.displayBold, fontSize: 14, lineHeight: 21 },
  track: {
    height: 12,
    borderRadius: 999,
    backgroundColor: '#F9EBE4',
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 999 },
});
