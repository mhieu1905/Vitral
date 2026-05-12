import { LinearGradient } from 'expo-linear-gradient';
import { Minus, Plus, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CupIcon } from './cup-icon';
import {
  WATER_CUSTOM_MAX_ML,
  WATER_CUSTOM_MIN_ML,
  WATER_CUSTOM_STEP_ML,
  WATER_QUICK_AMOUNTS_ML,
} from '@/constants/nutrition';
import { nutritionColors as c, nutritionFonts as f, waterColors as w } from '@/theme/nutrition';

type Props = {
  visible: boolean;
  initialSelected?: number;
  initialCustom?: number;
  onClose: () => void;
  onConfirm: (amount: number) => void;
};

export function AddWaterSheet({
  visible,
  initialSelected = 0,
  initialCustom = 350,
  onClose,
  onConfirm,
}: Props) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  const [mounted, setMounted] = useState(visible);
  const [selectedAmount, setSelectedAmount] = useState(initialSelected);
  const [customAmount, setCustomAmount] = useState(initialCustom);

  const translateY = useSharedValue(windowHeight);
  const backdrop = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      setSelectedAmount(initialSelected);
      setCustomAmount(initialCustom);
      translateY.value = withTiming(0, {
        duration: 320,
        easing: Easing.out(Easing.cubic),
      });
      backdrop.value = withTiming(1, { duration: 260 });
    } else if (mounted) {
      backdrop.value = withTiming(0, { duration: 220 });
      translateY.value = withTiming(
        windowHeight,
        { duration: 260, easing: Easing.in(Easing.cubic) },
        (finished) => {
          if (finished) runOnJS(setMounted)(false);
        },
      );
    }
  }, [visible, mounted, windowHeight, initialSelected, initialCustom, translateY, backdrop]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdrop.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!mounted) return null;

  const effectiveAmount = selectedAmount > 0 ? selectedAmount : customAmount;

  const decrement = () => {
    setSelectedAmount(0);
    setCustomAmount((v) => Math.max(WATER_CUSTOM_MIN_ML, v - WATER_CUSTOM_STEP_ML));
  };
  const increment = () => {
    setSelectedAmount(0);
    setCustomAmount((v) => Math.min(WATER_CUSTOM_MAX_ML, v + WATER_CUSTOM_STEP_ML));
  };

  return (
    <Modal transparent visible={mounted} statusBarTranslucent onRequestClose={onClose}>
      <View style={s.root}>
        <Animated.View style={[s.backdrop, backdropStyle]}>
          <Pressable style={s.backdropPress} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            s.sheet,
            { paddingBottom: Math.max(insets.bottom + 12, 28) },
            sheetStyle,
          ]}
        >
          <View style={s.handle} />

          <View style={s.headerRow}>
            <Text style={s.title}>Add Water</Text>
            <Pressable onPress={onClose} style={s.closeBtn} hitSlop={10}>
              <X size={14} color={w.textMuted} strokeWidth={2.5} />
            </Pressable>
          </View>

          <Text style={s.subhead}>Choose Amount</Text>

          <View style={s.grid}>
            {WATER_QUICK_AMOUNTS_ML.map((amt) => {
              const active = selectedAmount === amt;
              return (
                <Pressable
                  key={amt}
                  onPress={() => setSelectedAmount(amt)}
                  style={({ pressed }) => [
                    s.tile,
                    active && s.tileActive,
                    pressed && { transform: [{ scale: 0.97 }] },
                  ]}
                >
                  <View style={[s.tileIcon, active && s.tileIconActive]}>
                    {active ? (
                      <LinearGradient
                        colors={[w.primaryLight, w.primaryDeep]}
                        style={StyleSheet.absoluteFillObject}
                      />
                    ) : null}
                    <CupIcon
                      size={22}
                      stroke={active ? '#FFFFFF' : w.primary}
                      wave={active ? 'rgba(255,255,255,0.7)' : w.wave}
                    />
                  </View>
                  <Text style={[s.tileLabel, active && s.tileLabelActive]}>
                    {amt} ml
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={s.subhead}>Custom Amount</Text>
          <View style={s.stepperRow}>
            <Pressable onPress={decrement} style={s.stepBtn} hitSlop={6}>
              <Minus size={16} color={w.textMuted} strokeWidth={2.5} />
            </Pressable>
            <Text style={s.stepperValue}>{effectiveAmount} ml</Text>
            <Pressable onPress={increment} style={s.stepBtn} hitSlop={6}>
              <Plus size={16} color={w.textMuted} strokeWidth={2.5} />
            </Pressable>
          </View>

          <Pressable
            onPress={() => onConfirm(effectiveAmount)}
            style={({ pressed }) => [s.ctaWrap, pressed && { transform: [{ scale: 0.98 }] }]}
          >
            <LinearGradient
              colors={[w.primaryLight, w.primaryDeep]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.cta}
            >
              <Text style={s.ctaText}>Add Hydration</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  backdropPress: { ...StyleSheet.absoluteFillObject },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(196,181,172,0.45)',
    marginBottom: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: f.displayBold,
    fontSize: 18,
    color: w.textStrong,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: c.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subhead: {
    fontFamily: f.bodyMed,
    fontSize: 13,
    color: w.textMuted,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 22,
  },
  tile: {
    width: '23%',
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: w.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tileActive: {
    backgroundColor: w.tint,
    borderColor: w.primary,
  },
  tileIcon: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: w.tintSoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tileIconActive: {
    backgroundColor: w.primary,
  },
  tileLabel: {
    fontFamily: f.body,
    fontSize: 12,
    color: w.textMuted,
  },
  tileLabelActive: {
    color: w.primary,
    fontFamily: f.bodyBold,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: w.surface,
    borderWidth: 1,
    borderColor: w.border,
    marginBottom: 24,
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: c.textDark,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  stepperValue: {
    fontFamily: f.bodyBold,
    fontSize: 18,
    color: w.textBody,
  },
  ctaWrap: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: c.textDark,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 6,
  },
  cta: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: '#FFFFFF',
    fontFamily: f.displaySemi,
    fontSize: 16,
  },
});
