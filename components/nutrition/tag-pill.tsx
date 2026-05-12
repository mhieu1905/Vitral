import { StyleSheet, Text } from 'react-native';

import type { RecipeTagTone } from '@/constants/nutrition';
import { nutritionColors as c, nutritionFonts as f } from '@/theme/nutrition';

type Props = {
  label: string;
  tone: RecipeTagTone;
};

const TONE_BG: Record<RecipeTagTone, string> = {
  sage: 'rgba(168,197,160,0.2)',
  pink: 'rgba(253,203,203,0.2)',
  blue: 'rgba(171,190,222,0.2)',
};

const TONE_TEXT: Record<RecipeTagTone, string> = {
  sage: c.textDark,
  pink: c.pink,
  blue: c.blue,
};

export function TagPill({ label, tone }: Props) {
  return (
    <Text
      style={[
        s.pill,
        { backgroundColor: TONE_BG[tone], color: TONE_TEXT[tone] },
      ]}
    >
      {label}
    </Text>
  );
}

const s = StyleSheet.create({
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    fontFamily: f.displaySemi,
    fontSize: 12,
    lineHeight: 18,
    overflow: 'hidden',
  },
});
