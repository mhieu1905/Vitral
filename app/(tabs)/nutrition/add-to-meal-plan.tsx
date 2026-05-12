import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { CalendarDays, ChevronLeft, MoreVertical } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { DailyVitalityCard, SuccessDishRing } from '@/components/nutrition';
import { ADD_TO_MEAL_PLAN_DEFAULT as DATA } from '@/constants/nutrition';
import { nutritionColors as c, nutritionFonts as f } from '@/theme/nutrition';

export default function AddToMealPlanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const handlePrimary = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/nutrition/meal-planner');
  };

  const handleSecondary = () => {
    void Haptics.selectionAsync();
    router.dismissTo('/nutrition/recipe-detail');
  };

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.content, { paddingTop: insets.top + 84 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeIn.duration(700).easing(Easing.out(Easing.cubic))}
          style={s.heroWrap}
        >
          <SuccessDishRing source={DATA.dishImage} size={288} />
        </Animated.View>

        <View style={s.titleWrap}>
          <Animated.Text
            entering={FadeInUp.duration(540).delay(220).easing(Easing.out(Easing.cubic))}
            style={s.title}
          >
            <Text style={s.titlePrefix}>{DATA.titlePrefix}</Text>
            <Text style={s.titleAccent}>{DATA.titleAccent}</Text>
          </Animated.Text>
          <Animated.Text
            entering={FadeInUp.duration(500).delay(380)}
            style={s.subtitle}
          >
            {DATA.subtitle}
          </Animated.Text>
        </View>

        <Animated.View
          entering={FadeInUp.duration(620).delay(500).easing(Easing.out(Easing.cubic))}
          style={s.cardWrap}
        >
          <DailyVitalityCard
            kicker={DATA.kicker}
            consumedKcal={DATA.consumedKcal}
            totalKcal={DATA.totalKcal}
            pct={DATA.pct}
            macros={DATA.macros}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(500).delay(820)}
          style={s.actions}
        >
          <Pressable
            style={({ pressed }) => [s.primaryBtn, pressed && { opacity: 0.92 }]}
            onPress={handlePrimary}
          >
            <Text style={s.primaryText}>{DATA.primaryLabel}</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [s.secondaryBtn, pressed && { opacity: 0.88 }]}
            onPress={handleSecondary}
          >
            <Text style={s.secondaryText}>{DATA.secondaryLabel}</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>

      <View style={[s.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable
          hitSlop={10}
          onPress={() => router.dismissTo('/nutrition/recipe-detail')}
          style={s.iconBtn}
        >
          <ChevronLeft size={20} color={c.textDark} strokeWidth={2.5} />
        </Pressable>
        <View style={s.topRight}>
          <Pressable hitSlop={8} style={s.iconBtn}>
            <CalendarDays size={18} color={c.textDark} strokeWidth={2} />
          </Pressable>
          <Pressable hitSlop={8} style={s.iconBtn}>
            <MoreVertical size={18} color={c.textDark} strokeWidth={2} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingBottom: 56 },

  heroWrap: { alignItems: 'center', paddingVertical: 8 },

  titleWrap: { marginTop: 28, alignItems: 'center', gap: 14 },
  title: {
    fontFamily: f.displayBold,
    fontSize: 34,
    color: c.textDark,
    letterSpacing: -0.85,
    lineHeight: 42,
    textAlign: 'center',
  },
  titlePrefix: { fontFamily: f.displayBold, color: c.textDark },
  titleAccent: {
    fontFamily: f.displayBold,
    color: c.sageDark,
    fontStyle: 'italic',
  },
  subtitle: {
    fontFamily: f.displayMed,
    fontSize: 16,
    color: 'rgba(67,72,64,0.78)',
    lineHeight: 24,
    textAlign: 'center',
  },

  cardWrap: { marginTop: 32 },

  actions: { marginTop: 40, gap: 14 },
  primaryBtn: {
    backgroundColor: c.sageDark,
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: 'center',
    shadowColor: c.sageDark,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 16,
    elevation: 8,
  },
  primaryText: {
    fontFamily: f.displayBold,
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  secondaryBtn: {
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(75,101,70,0.2)',
    backgroundColor: 'transparent',
  },
  secondaryText: {
    fontFamily: f.displayBold,
    fontSize: 16,
    color: c.sageDark,
    lineHeight: 24,
  },

  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 50,
    backgroundColor: 'rgba(255,248,245,0.6)',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
