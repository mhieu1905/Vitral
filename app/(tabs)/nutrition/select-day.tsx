import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  SelectDayHeader,
  SelectDayHelperCard,
  SelectDayMealRow,
} from '@/components/nutrition';
import {
  SELECT_DAY_HEADER,
  SELECT_DAY_QUOTE,
  SELECT_DAY_SLOTS,
} from '@/constants/nutrition';
import { nutritionColors as c, nutritionFonts as f } from '@/theme/nutrition';

export default function SelectDayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.content, { paddingTop: insets.top + 88 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(400)}>
          <SelectDayHeader
            monthLabel={SELECT_DAY_HEADER.monthLabel}
            dateLabel={SELECT_DAY_HEADER.dateLabel}
          />
        </Animated.View>

        <View style={s.slotList}>
          {SELECT_DAY_SLOTS.map((slot, idx) => (
            <Animated.View
              key={slot.id}
              entering={FadeInUp.duration(400).delay(80 + idx * 60)}
            >
              <SelectDayMealRow
                slot={slot}
                onPress={
                  slot.status === 'planned'
                    ? () => router.push('/nutrition/recipe-library')
                    : undefined
                }
              />
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeInUp.duration(500).delay(420)} style={s.helperWrap}>
          <SelectDayHelperCard quote={SELECT_DAY_QUOTE} />
        </Animated.View>
      </ScrollView>

      <View style={[s.topBar, { paddingTop: insets.top + 12 }]}>
        <Pressable
          style={s.backBtn}
          hitSlop={10}
          onPress={() => router.dismissTo('/nutrition/meal-planner')}
        >
          <ChevronLeft size={18} color={c.sageDark} strokeWidth={2.5} />
        </Pressable>
        <Text style={s.topTitle}>SELECT MEAL</Text>
        <View style={s.topSpacer} />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingBottom: 64 },

  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: 'rgba(255,248,245,0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 50,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: c.cardCream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    fontFamily: f.displayBold,
    fontSize: 15,
    color: '#546B4A',
    letterSpacing: 1.5,
    lineHeight: 22.5,
  },
  topSpacer: { width: 40, height: 40 },

  slotList: { marginTop: 24, gap: 16 },
  helperWrap: { marginTop: 32 },
});
