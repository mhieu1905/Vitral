import { Image } from 'expo-image';
import { Heart } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { RecipeCardData } from '@/constants/nutrition';
import { nutritionColors as c, nutritionFonts as f } from '@/theme/nutrition';

type Props = {
  recipe: RecipeCardData;
  onPress?: () => void;
  onToggleLike?: () => void;
};

export function RecipeCard({ recipe, onPress, onToggleLike }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.card, pressed && { opacity: 0.92 }]}
    >
      <View style={s.imageWrap}>
        <Image source={recipe.image} style={s.image} contentFit="cover" />
        <Pressable hitSlop={6} style={s.heartBtn} onPress={onToggleLike}>
          <Heart
            size={14}
            color={recipe.liked ? '#7B5455' : c.textDim}
            strokeWidth={2}
            fill={recipe.liked ? '#7B5455' : 'transparent'}
          />
        </Pressable>
      </View>
      <View style={s.info}>
        <Text style={s.title} numberOfLines={2}>
          {recipe.title}
        </Text>
        <Text style={s.meta}>{recipe.meta}</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: c.card,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  imageWrap: { width: '100%', aspectRatio: 1, backgroundColor: c.cardCream },
  image: { flex: 1 },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: 'rgba(255,248,245,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { padding: 12, gap: 4 },
  title: {
    fontFamily: f.displaySemi,
    fontSize: 13,
    color: c.textDark,
    lineHeight: 16.25,
  },
  meta: {
    fontFamily: f.display,
    fontSize: 10,
    color: c.textMuted,
    lineHeight: 15,
  },
});
