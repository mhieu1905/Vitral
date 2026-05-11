import { Image } from 'expo-image';
import { UtensilsCrossed } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { DashboardMealItem } from '@/constants/nutrition';
import { nutritionColors as c, nutritionFonts as f } from '@/theme/nutrition';

type Props = {
  meal: DashboardMealItem;
  onPress?: () => void;
};

export function MealCard({ meal, onPress }: Props) {
  return (
    <Pressable style={[s.card, meal.empty && s.cardEmpty]} onPress={onPress}>
      {meal.empty || !meal.image ? (
        <View style={s.emptyImg}>
          <UtensilsCrossed size={30} color={c.textMuted2} strokeWidth={1.6} />
        </View>
      ) : (
        <View style={s.imgWrap}>
          <Image source={meal.image} style={s.img} contentFit="cover" />
          {meal.kcal ? (
            <View style={s.kcalBadge}>
              <Text style={s.kcalBadgeText}>{meal.kcal}</Text>
            </View>
          ) : null}
        </View>
      )}
      <Text style={s.title}>{meal.title}</Text>
      <Text style={s.desc} numberOfLines={1}>
        {meal.desc}
      </Text>
      <View style={s.footer}>
        <Text style={s.time}>{meal.time}</Text>
        <View style={s.dots}>
          <View style={s.dot} />
          <View style={s.dot} />
          <View style={s.dot} />
        </View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: c.card,
    borderRadius: 28,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    elevation: 1,
  },
  cardEmpty: { opacity: 0.85 },

  imgWrap: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: c.cardCream,
  },
  img: { width: '100%', height: '100%' },
  emptyImg: {
    height: 280,
    backgroundColor: '#F9EBE4',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#C3C8BE',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },

  kcalBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  kcalBadgeText: { fontFamily: f.displayBold, fontSize: 10, color: c.sageDark, lineHeight: 15 },

  title: { marginTop: 13, fontFamily: f.displaySemi, fontSize: 16, color: c.textDark, lineHeight: 24 },
  desc: { fontFamily: f.display, fontSize: 12, color: c.textMuted, lineHeight: 19.5 },

  footer: {
    marginTop: 13,
    paddingTop: 17,
    borderTopWidth: 1,
    borderTopColor: c.cardCream,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: { fontFamily: f.displayBold, fontSize: 10, color: c.blue, letterSpacing: 0.5, lineHeight: 15 },
  dots: { flexDirection: 'row', gap: 2 },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: c.textMuted },
});
