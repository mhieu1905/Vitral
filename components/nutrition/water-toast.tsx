import { LinearGradient } from 'expo-linear-gradient';
import { Check, X } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { nutritionColors as c, nutritionFonts as f, waterColors as w } from '@/theme/nutrition';

type Props = {
  visible: boolean;
  amount: number;
  bottomOffset?: number;
  onDismiss: () => void;
};

export function WaterToast({ visible, amount, bottomOffset = 96, onDismiss }: Props) {
  const offset = useSharedValue(80);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      offset.value = withTiming(0, { duration: 280, easing: Easing.out(Easing.cubic) });
      opacity.value = withTiming(1, { duration: 220 });
    } else {
      offset.value = withTiming(80, { duration: 220, easing: Easing.in(Easing.cubic) });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, offset, opacity]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[s.wrap, { bottom: bottomOffset }, style]}
    >
      <LinearGradient
        colors={[w.successFrom, w.successTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.toast}
      >
        <View style={s.left}>
          <View style={s.iconBox}>
            <Check size={16} color="#FFFFFF" strokeWidth={3} />
          </View>
          <View>
            <Text style={s.title}>+{amount} ml Added!</Text>
            <Text style={s.sub}>Nice! You&apos;re staying hydrated.</Text>
          </View>
        </View>
        <Pressable onPress={onDismiss} hitSlop={10}>
          <X size={16} color="rgba(255,255,255,0.7)" strokeWidth={2.5} />
        </Pressable>
      </LinearGradient>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 100,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    shadowColor: c.textDark,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 24,
    elevation: 8,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontFamily: f.bodyBold,
    fontSize: 14,
  },
  sub: {
    color: 'rgba(255,255,255,0.75)',
    fontFamily: f.body,
    fontSize: 12,
    marginTop: 1,
  },
});
