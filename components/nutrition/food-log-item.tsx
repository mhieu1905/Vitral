import { Image } from 'expo-image';
import { MoreHorizontal } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { FoodLogItemData } from '@/constants/nutrition';
import { nutritionColors as c, nutritionFonts as f } from '@/theme/nutrition';

type Props = {
  item: FoodLogItemData;
  onPress?: () => void;
  onMore?: () => void;
};

export function FoodLogItem({ item, onPress, onMore }: Props) {
  return (
    <Pressable style={s.row} onPress={onPress}>
      <View style={s.thumb}>
        <Image source={item.image} style={s.thumbImg} contentFit="cover" />
      </View>
      <View style={s.textWrap}>
        <Text style={s.title}>{item.title}</Text>
        <Text style={s.meta}>{item.meta}</Text>
      </View>
      <Pressable hitSlop={8} style={s.more} onPress={onMore}>
        <MoreHorizontal size={16} color={c.textMuted} strokeWidth={2} />
      </Pressable>
    </Pressable>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: c.bgAlt,
    overflow: 'hidden',
  },
  thumbImg: { width: '100%', height: '100%' },
  textWrap: { flex: 1 },
  title: { fontFamily: f.displaySemi, fontSize: 16, color: c.sageDark, lineHeight: 24 },
  meta: { fontFamily: f.display, fontSize: 11, color: 'rgba(75,101,70,0.5)', lineHeight: 16.5 },
  more: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
