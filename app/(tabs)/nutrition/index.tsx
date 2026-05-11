import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Bell, BookOpen, ChartPie, Droplets, Leaf, UtensilsCrossed } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomNav from '@/components/bottom-nav';
import { NutritionAvatar, NutritionTopBar, RingProgress } from '@/components/nutrition';
import { nutritionColors as c, nutritionFonts as f } from '@/theme/nutrition';

const WATER_RING_SIZE = 128;
const WATER_STROKE = 10;
const WATER_PCT = 1.2 / 2.5;

export default function NutritionHub() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.welcome}>
          <Text style={s.welcomeTitle}>Explore Wellness</Text>
          <Text style={s.welcomeSub}>
            Welcome back to your mindful space. Nourish your body and mind with intentional choices today.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.95}
          style={s.featuredCard}
          onPress={() => router.push('/nutrition/dashboard')}
        >
          <View style={s.featuredOverlay}>
            <Image source={require('@/assets/images/nutrition/greenery.png')} style={s.featuredBgImg} contentFit="cover" />
          </View>
          <View style={s.featuredIconBox}>
            <Leaf size={22} color={c.sageDark} strokeWidth={2} />
          </View>
          <Text style={s.featuredTitle}>Nutrition Dashboard</Text>
          <Text style={s.featuredDesc}>
            A holistic overview of your daily intake, macro-balance, and health insights.
          </Text>
          <View style={s.featuredCTARow}>
            <View style={s.featuredCTABtn}>
              <Text style={s.featuredCTAText}>View Trends</Text>
            </View>
            <Text style={s.featuredCTAKicker}>LIVE UPDATES</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.95}
          style={s.waterCard}
          onPress={() => router.push('/nutrition/dashboard')}
        >
          <View style={s.waterIconBox}>
            <Droplets size={24} color={c.blue} strokeWidth={2} />
          </View>
          <Text style={s.waterHubTitle}>Water Log</Text>
          <Text style={s.waterHubDesc}>Stay hydrated and track your daily fluid intake.</Text>

          <View style={s.waterRingWrap}>
            <RingProgress
              size={WATER_RING_SIZE}
              stroke={WATER_STROKE}
              pct={WATER_PCT}
              color={c.blue}
              trackColor="rgba(171,190,222,0.3)"
            >
              <Text style={s.waterRingValue}>1.2L</Text>
            </RingProgress>
          </View>

          <View style={s.waterLogBtn}>
            <Text style={s.waterLogBtnText}>Log Intake</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.95}
          style={s.foodLogCard}
          onPress={() => router.push('/nutrition/food-log')}
        >
          <View style={s.foodLogIconBox}>
            <UtensilsCrossed size={18} color={c.pink} strokeWidth={2} />
          </View>
          <View style={s.foodLogTextWrap}>
            <Text style={s.foodLogTitle}>Food Log</Text>
            <Text style={s.foodLogDesc}>Quickly record your meals and track calories with ease.</Text>
            <View style={s.foodLogChips}>
              <View style={s.foodChip}><Text style={s.foodChipText}>BREAKFAST</Text></View>
              <View style={s.foodChip}><Text style={s.foodChipText}>LUNCH</Text></View>
              <View style={[s.foodChip, { marginTop: 8 }]}><Text style={s.foodChipText}>DINNER</Text></View>
            </View>
          </View>
        </TouchableOpacity>

        <View style={s.halfCardsRow}>
          <TouchableOpacity
            activeOpacity={0.95}
            style={[s.halfCard, { backgroundColor: c.cardPeach }]}
            onPress={() => router.push('/nutrition/add-food')}
          >
            <BookOpen size={22} color={c.pink} strokeWidth={2} />
            <Text style={s.halfCardTitle}>Meal Planner</Text>
            <Text style={s.halfCardDesc}>Organize your week with curated healthy recipes.</Text>
          </TouchableOpacity>
        </View>

        <View style={s.halfCardsRow}>
          <TouchableOpacity
            activeOpacity={0.95}
            style={[s.halfCard, { backgroundColor: c.cardCream }]}
            onPress={() => router.push('/nutrition/dashboard')}
          >
            <ChartPie size={22} color={c.sageDark} strokeWidth={2} />
            <Text style={s.halfCardTitle}>Nutrition Reports</Text>
            <Text style={s.halfCardDesc}>Deep dive into your nutritional data over time.</Text>
          </TouchableOpacity>
        </View>

        <View style={s.quoteSection}>
          <View style={s.zenWrap}>
            <Image source={require('@/assets/images/nutrition/zen-stones.png')} style={s.zenImg} contentFit="cover" />
          </View>

          <View style={s.quoteTextWrap}>
            <Text style={s.quoteMark}>&ldquo;</Text>
            <Text style={s.quoteText}>
              The food you eat can be either the safest and most powerful form of medicine or the slowest form of poison.
            </Text>
            <Text style={s.quoteCite}>— ANN WIGMORE</Text>
          </View>
        </View>
      </ScrollView>

      <NutritionTopBar
        title="Nutrition"
        leftIcon={Leaf}
        backgroundColor={c.bgAlt}
        titleStyle={s.hubTitle}
        rightSlot={
          <>
            <Pressable hitSlop={6}>
              <Bell size={18} color={c.textDark2} strokeWidth={2} />
            </Pressable>
            <NutritionAvatar variant="subtle" />
          </>
        }
      />

      <BottomNav />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.bg },
  scroll: { flex: 1 },
  content: { paddingTop: 90, paddingBottom: 130 },

  hubTitle: { fontSize: 24, color: c.textDark2, lineHeight: 32, letterSpacing: -0.6 },

  welcome: { paddingHorizontal: 24, gap: 8 },
  welcomeTitle: {
    fontFamily: f.displaySemi,
    fontSize: 28,
    color: c.textDark2,
    lineHeight: 42,
  },
  welcomeSub: {
    fontFamily: f.display,
    fontSize: 17,
    color: c.textMuted2,
    lineHeight: 27.6,
  },

  featuredCard: {
    marginTop: 32,
    marginHorizontal: 24,
    padding: 32,
    backgroundColor: c.card,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#3D3530',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 20 },
    shadowRadius: 25,
    elevation: 3,
  },
  featuredOverlay: { ...StyleSheet.absoluteFillObject, opacity: 0.1 },
  featuredBgImg: { width: '100%', height: '100%' },
  featuredIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: c.sageBg20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredTitle: {
    marginTop: 24,
    fontFamily: f.displayBold,
    fontSize: 24,
    color: c.textDark2,
    lineHeight: 32,
  },
  featuredDesc: {
    marginTop: 8,
    fontFamily: f.display,
    fontSize: 16,
    color: c.textMuted2,
    lineHeight: 24,
    maxWidth: 280,
  },
  featuredCTARow: { marginTop: 48, flexDirection: 'row', alignItems: 'center', gap: 16 },
  featuredCTABtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: c.sageDark,
    borderRadius: 999,
  },
  featuredCTAText: { fontFamily: f.displayMed, fontSize: 16, color: '#FFFFFF', lineHeight: 24 },
  featuredCTAKicker: { fontFamily: f.displayBold, fontSize: 12, color: c.sageDark, letterSpacing: 1.2 },

  waterCard: {
    marginTop: 24,
    marginHorizontal: 24,
    padding: 32,
    backgroundColor: 'rgba(171,190,222,0.3)',
    borderRadius: 32,
    alignItems: 'center',
  },
  waterIconBox: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: c.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    elevation: 1,
  },
  waterHubTitle: { marginTop: 24, fontFamily: f.displayBold, fontSize: 20, color: c.textDark2, lineHeight: 28 },
  waterHubDesc: { marginTop: 8, fontFamily: f.display, fontSize: 14, color: c.textMuted2, lineHeight: 20, textAlign: 'center' },
  waterRingWrap: { marginTop: 32 },
  waterRingValue: {
    fontFamily: f.displayBold,
    fontSize: 20,
    color: c.blue,
    lineHeight: 28,
  },
  waterLogBtn: {
    marginTop: 32,
    alignSelf: 'stretch',
    paddingVertical: 12,
    backgroundColor: c.card,
    borderRadius: 16,
    alignItems: 'center',
  },
  waterLogBtnText: { fontFamily: f.displayBold, fontSize: 14, color: c.textDark2, lineHeight: 20 },

  foodLogCard: {
    marginTop: 24,
    marginHorizontal: 24,
    padding: 33,
    flexDirection: 'row',
    gap: 24,
    backgroundColor: 'rgba(253,203,203,0.2)',
    borderColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderRadius: 32,
  },
  foodLogIconBox: {
    width: 50,
    height: 48,
    borderRadius: 12,
    backgroundColor: c.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  foodLogTextWrap: { flex: 1 },
  foodLogTitle: { fontFamily: f.displayBold, fontSize: 20, color: c.textDark2, lineHeight: 28 },
  foodLogDesc: { marginTop: 4, fontFamily: f.display, fontSize: 14, color: c.textMuted2, lineHeight: 20 },
  foodLogChips: { marginTop: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  foodChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  foodChipText: { fontFamily: f.displayBold, fontSize: 11, color: c.pink, lineHeight: 16.5, letterSpacing: 0.3 },

  halfCardsRow: { marginTop: 24, marginHorizontal: 24 },
  halfCard: {
    padding: 32,
    borderRadius: 32,
    gap: 16,
  },
  halfCardTitle: { fontFamily: f.displayBold, fontSize: 18, color: c.textDark2, lineHeight: 28 },
  halfCardDesc: { fontFamily: f.display, fontSize: 12, color: c.textMuted2, lineHeight: 16, marginTop: -8 },

  quoteSection: {
    marginTop: 48,
    marginHorizontal: 24,
    paddingTop: 81,
    borderTopWidth: 1,
    borderTopColor: 'rgba(115,121,112,0.1)',
    alignItems: 'center',
    gap: 48,
  },
  zenWrap: {
    width: 256,
    height: 256,
    borderRadius: 48,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 15,
    elevation: 5,
  },
  zenImg: { width: '100%', height: '100%' },
  quoteTextWrap: { width: '100%', maxWidth: 342 },
  quoteMark: {
    fontFamily: f.displayBold,
    fontSize: 48,
    color: c.sageDark,
    lineHeight: 48,
  },
  quoteText: {
    marginTop: 16,
    fontFamily: f.displayMed,
    fontSize: 22,
    color: c.textDark2,
    lineHeight: 35.75,
    fontStyle: 'italic',
  },
  quoteCite: {
    marginTop: 32,
    fontFamily: f.displaySemi,
    fontSize: 12,
    color: c.textMuted2,
    letterSpacing: 2.4,
    lineHeight: 16,
    fontStyle: 'italic',
  },
});
