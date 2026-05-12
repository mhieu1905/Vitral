import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';
import { useEffect } from 'react';
import { StyleSheet, View, type ImageSourcePropType } from 'react-native';
import Animated, {
  Easing,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { nutritionColors as c } from '@/theme/nutrition';

type Props = {
  source: ImageSourcePropType;
  size?: number;
};

export function SuccessDishRing({ source, size = 288 }: Props) {
  const glow = useSharedValue(0.4);
  const sparkleRotate = useSharedValue(0);
  const sparkleScale = useSharedValue(0.92);
  const ringRotate = useSharedValue(0);

  useEffect(() => {
    glow.value = withRepeat(
      withTiming(0.75, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    sparkleRotate.value = withRepeat(
      withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
    sparkleScale.value = withRepeat(
      withTiming(1.04, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    ringRotate.value = withRepeat(
      withTiming(360, { duration: 24000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [glow, sparkleRotate, sparkleScale, ringRotate]);

  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.value }));
  const sparkleStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${12 + sparkleRotate.value * 18 - 9}deg` },
      { scale: sparkleScale.value },
    ],
  }));
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ringRotate.value}deg` }],
  }));

  const ringPadding = 6;

  return (
    <View style={[s.wrap, { width: size, height: size }]}>
      <Animated.View
        pointerEvents="none"
        style={[
          s.aura,
          {
            width: size + 140,
            height: size + 140,
            left: -70,
            top: -70,
            borderRadius: (size + 140) / 2,
          },
          glowStyle,
        ]}
      />

      <Animated.View
        style={[
          s.ringGradient,
          { width: size, height: size, borderRadius: size / 2, padding: ringPadding },
          ringStyle,
        ]}
      >
        <LinearGradient
          colors={[
            'rgba(75,101,70,0.35)',
            'rgba(75,101,70,0)',
            'rgba(168,197,160,0.4)',
            'rgba(75,101,70,0.35)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFillObject, { borderRadius: size / 2 }]}
        />
      </Animated.View>

      <View style={[s.imgFrame, { width: size, height: size, borderRadius: size / 2 }]}>
        <View
          style={[
            s.imgInner,
            { width: size - 12, height: size - 12, borderRadius: (size - 12) / 2 },
          ]}
        >
          <Image source={source} style={s.image} contentFit="cover" />
        </View>
      </View>

      <Animated.View
        entering={ZoomIn.delay(420).duration(540).springify().damping(11)}
        style={[s.badgeAnchor, { right: -8, bottom: -8 }]}
      >
        <Animated.View style={[s.badge, sparkleStyle]}>
          <Sparkles size={28} color="#FFFFFF" strokeWidth={2.2} fill="#FFFFFF" />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },

  aura: {
    position: 'absolute',
    backgroundColor: 'rgba(168,197,160,0.35)',
  },

  ringGradient: {
    position: 'absolute',
    overflow: 'hidden',
  },

  imgFrame: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    padding: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 25 },
    shadowRadius: 30,
    elevation: 14,
  },
  imgInner: {
    overflow: 'hidden',
    backgroundColor: c.cardCream,
  },
  image: { flex: 1 },

  badgeAnchor: { position: 'absolute' },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: c.sageDark,
    borderWidth: 4,
    borderColor: c.bg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: c.sageDark,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 10,
  },
});
