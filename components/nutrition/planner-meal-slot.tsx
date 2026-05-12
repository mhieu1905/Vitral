import { Image } from 'expo-image';
import { GripVertical, MoreHorizontal, Plus } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { MealPlannerSlot } from '@/constants/nutrition';
import { nutritionColors as c, nutritionFonts as f } from '@/theme/nutrition';

type Props = {
  slot: MealPlannerSlot;
  onMore?: () => void;
  onAdd?: () => void;
};

export function PlannerMealSlot({ slot, onMore, onAdd }: Props) {
  return (
    <View style={s.slot}>
      <View style={s.header}>
        <View style={s.headerLeft}>
          <GripVertical size={14} color={c.textHint} strokeWidth={2} />
          <Text style={s.title}>{slot.title}</Text>
        </View>
        {slot.kcal ? (
          <View style={s.kcalBadge}>
            <Text style={s.kcalBadgeText}>{slot.kcal}</Text>
          </View>
        ) : null}
      </View>

      {slot.empty ? (
        <TouchableOpacity activeOpacity={0.85} style={s.emptyCard} onPress={onAdd}>
          <Plus size={20} color={c.textMuted} strokeWidth={2} />
          <Text style={s.emptyText}>Add meal</Text>
        </TouchableOpacity>
      ) : slot.food ? (
        <View style={s.foodCard}>
          <View style={s.foodImageWrap}>
            <Image source={slot.food.image} style={s.foodImage} contentFit="cover" />
          </View>
          <View style={s.foodInfo}>
            <Text style={s.foodName} numberOfLines={2}>
              {slot.food.name}
            </Text>
            <Text style={s.foodMeta}>{slot.food.meta}</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} style={s.moreBtn} hitSlop={6} onPress={onMore}>
            <MoreHorizontal size={18} color={c.textMuted} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  slot: { gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontFamily: f.displaySemi, fontSize: 18, color: c.textDark, lineHeight: 28 },

  kcalBadge: {
    backgroundColor: c.cardPeach,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  kcalBadgeText: {
    fontFamily: f.displayBold,
    fontSize: 11,
    color: c.textDim,
    lineHeight: 17,
  },

  foodCard: {
    backgroundColor: c.card,
    borderRadius: 24,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  foodImageWrap: {
    width: 80,
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: c.cardCream,
  },
  foodImage: { flex: 1 },
  foodInfo: { flex: 1, gap: 2 },
  foodName: { fontFamily: f.displaySemi, fontSize: 16, color: c.textDark, lineHeight: 20 },
  foodMeta: { fontFamily: f.display, fontSize: 14, color: c.textMuted, lineHeight: 20 },
  moreBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyCard: {
    height: 96,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#C3C8BE',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  emptyText: { fontFamily: f.displayMed, fontSize: 14, color: c.textMuted, lineHeight: 20 },
});
