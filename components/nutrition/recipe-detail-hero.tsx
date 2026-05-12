import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, type ImageSourcePropType } from 'react-native';

import { nutritionColors as c } from '@/theme/nutrition';

type Props = {
  source: ImageSourcePropType;
  height?: number;
};

export function RecipeDetailHero({ source, height = 450 }: Props) {
  return (
    <View style={[s.wrap, { height }]}>
      <Image source={source} style={s.image} contentFit="cover" />
      <LinearGradient
        colors={['rgba(255,248,245,0)', 'rgba(255,248,245,0)', c.bg]}
        locations={[0, 0.5, 1]}
        style={s.gradient}
        pointerEvents="none"
      />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { width: '100%', overflow: 'hidden', backgroundColor: c.cardCream },
  image: { ...StyleSheet.absoluteFillObject },
  gradient: { ...StyleSheet.absoluteFillObject },
});
