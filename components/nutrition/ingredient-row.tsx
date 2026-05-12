import { ChevronRight } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import type { RecipeIngredient, RecipeTagTone } from '@/constants/nutrition';
import { nutritionColors as c, nutritionFonts as f } from '@/theme/nutrition';

type Props = {
  ingredient: RecipeIngredient;
};

const TONE_BG: Record<RecipeTagTone, string> = {
  sage: 'rgba(168,197,160,0.3)',
  pink: 'rgba(253,203,203,0.3)',
  blue: 'rgba(171,190,222,0.3)',
};

const TONE_ICON: Record<RecipeTagTone, string> = {
  sage: c.sageDark,
  pink: c.pink,
  blue: c.blue,
};

export function IngredientRow({ ingredient }: Props) {
  const Icon = ingredient.icon;
  return (
    <View style={s.card}>
      <View style={[s.iconCircle, { backgroundColor: TONE_BG[ingredient.tone] }]}>
        <Icon size={20} color={TONE_ICON[ingredient.tone]} strokeWidth={1.8} />
      </View>
      <View style={s.info}>
        <Text style={s.name}>{ingredient.name}</Text>
        <Text style={s.meta}>{ingredient.meta}</Text>
      </View>
      <ChevronRight size={18} color={c.textMuted} strokeWidth={2} />
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: c.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    elevation: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 1 },
  name: { fontFamily: f.displaySemi, fontSize: 14, color: c.textDark, lineHeight: 21 },
  meta: { fontFamily: f.display, fontSize: 11, color: c.textDim, lineHeight: 16.5 },
});
