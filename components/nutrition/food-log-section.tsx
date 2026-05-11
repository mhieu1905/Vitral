import { Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { FoodLogSectionData } from '@/constants/nutrition';
import { nutritionColors as c, nutritionFonts as f } from '@/theme/nutrition';

import { FoodLogItem } from './food-log-item';

type Props = {
  section: FoodLogSectionData;
  onAdd?: () => void;
  onItemPress?: (itemId: string) => void;
  onItemMore?: (itemId: string) => void;
};

export function FoodLogSection({ section, onAdd, onItemPress, onItemMore }: Props) {
  const Icon = section.Icon;
  return (
    <View style={s.card}>
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.iconBox}>
            <Icon size={22} color={c.sageDark} strokeWidth={2} />
          </View>
          <View>
            <Text style={s.title}>{section.title}</Text>
            <Text style={s.consumed}>{section.consumed}</Text>
          </View>
        </View>
        <Pressable style={s.plusBtn} onPress={onAdd} hitSlop={6}>
          <Plus size={11} color="#FFFFFF" strokeWidth={2.5} />
        </Pressable>
      </View>

      <View style={s.itemsList}>
        {section.items.map((it) => (
          <FoodLogItem
            key={it.id}
            item={it}
            onPress={onItemPress ? () => onItemPress(it.id) : undefined}
            onMore={onItemMore ? () => onItemMore(it.id) : undefined}
          />
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    marginTop: 32,
    marginHorizontal: 24,
    backgroundColor: c.card,
    borderRadius: 32,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(168,197,160,0.05)',
    shadowColor: 'rgba(75,101,70,1)',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 30,
    elevation: 2,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 20,
    backgroundColor: c.bgAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: f.displayBold, fontSize: 18, color: c.sageDark, lineHeight: 22.5 },
  consumed: { fontFamily: f.display, fontSize: 12, color: 'rgba(75,101,70,0.5)', lineHeight: 16, marginTop: 2 },
  plusBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: c.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemsList: { marginTop: 24, gap: 20 },
});
