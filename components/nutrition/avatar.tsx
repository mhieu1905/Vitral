import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { nutritionColors as c } from '@/theme/nutrition';

type AvatarVariant = 'subtle' | 'sage' | 'sageFaded';

type Props = {
  variant?: AvatarVariant;
};

const VARIANT_STYLE: Record<AvatarVariant, object> = {
  subtle: { borderWidth: 1, borderColor: 'rgba(115,121,112,0.15)' },
  sage: {
    borderWidth: 2,
    borderColor: c.sage,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  sageFaded: { borderWidth: 2, borderColor: 'rgba(168,197,160,0.2)' },
};

export function NutritionAvatar({ variant = 'subtle' }: Props) {
  return (
    <View style={[s.ring, VARIANT_STYLE[variant]]}>
      <Image source={require('@/assets/images/nutrition/profile.png')} style={s.img} contentFit="cover" />
    </View>
  );
}

const s = StyleSheet.create({
  ring: {
    width: 40,
    height: 40,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: c.cardCream,
  },
  img: { flex: 1 },
});
