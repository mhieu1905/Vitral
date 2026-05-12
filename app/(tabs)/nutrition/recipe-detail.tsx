import { useRouter } from 'expo-router';
import { ChevronLeft, Heart, Share2 } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  IngredientRow,
  InstructionStep,
  NutritionProgressRow,
  RecipeDetailHero,
  RecipeHeaderCard,
} from '@/components/nutrition';
import { LEMON_GARLIC_SALMON_DETAIL as RECIPE } from '@/constants/nutrition';
import { nutritionColors as c, nutritionFonts as f } from '@/theme/nutrition';

export default function RecipeDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <RecipeDetailHero source={RECIPE.heroImage} height={450} />

        <View style={s.mainWrap}>
          <RecipeHeaderCard title={RECIPE.title} tags={RECIPE.tags} stats={RECIPE.stats} />

          <View style={s.section}>
            <View style={s.sectionHeadRow}>
              <View>
                <Text style={s.sectionTitle}>Nutrition</Text>
                <Text style={s.sectionSubtitle}>{RECIPE.nutritionSubtitle}</Text>
              </View>
              <Pressable hitSlop={6}>
                <Text style={s.linkText}>View All</Text>
              </Pressable>
            </View>

            <View style={s.nutritionList}>
              {RECIPE.nutrition.map((n) => (
                <NutritionProgressRow
                  key={n.label}
                  label={n.label}
                  pct={n.pct}
                  display={n.display}
                  tone={n.tone}
                />
              ))}
            </View>
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Ingredients</Text>
            <View style={s.ingredientsCard}>
              {RECIPE.ingredients.map((i) => (
                <IngredientRow key={i.id} ingredient={i} />
              ))}
            </View>
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Instructions</Text>
            <View style={s.instructionsList}>
              {RECIPE.instructions.map((step, idx) => (
                <InstructionStep
                  key={step.id}
                  instruction={step}
                  showConnector={idx < RECIPE.instructions.length - 1}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={s.bottomBar}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={s.cta}
          onPress={() => router.push('/nutrition/add-to-meal-plan')}
        >
          <Text style={s.ctaText}>{RECIPE.ctaLabel}</Text>
        </TouchableOpacity>
      </View>

      <View style={[s.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable
          hitSlop={10}
          onPress={() => router.dismissTo('/nutrition/recipe-library')}
          style={s.iconBtn}
        >
          <ChevronLeft size={20} color={c.textDark} strokeWidth={2.5} />
        </Pressable>
        <View style={s.topRight}>
          <Pressable hitSlop={8} style={s.iconBtn}>
            <Share2 size={18} color={c.textDark} strokeWidth={2} />
          </Pressable>
          <Pressable hitSlop={8} style={s.iconBtn}>
            <Heart size={20} color={c.pink} strokeWidth={2} fill={c.pink} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.bg },
  scroll: { flex: 1 },
  content: { paddingBottom: 120 },

  mainWrap: { marginTop: -48, paddingHorizontal: 24, gap: 32 },

  section: { gap: 24 },
  sectionHeadRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  sectionTitle: {
    fontFamily: f.displayBold,
    fontSize: 22,
    color: c.textDark,
    lineHeight: 33,
  },
  sectionSubtitle: {
    fontFamily: f.display,
    fontSize: 14,
    color: c.textDim,
    lineHeight: 22.75,
  },
  linkText: {
    fontFamily: f.displaySemi,
    fontSize: 14,
    color: c.sageDark,
    lineHeight: 21,
  },

  nutritionList: { gap: 24 },

  ingredientsCard: {
    backgroundColor: c.cardCream,
    borderRadius: 24,
    padding: 24,
    gap: 12,
  },

  instructionsList: { gap: 16 },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,248,245,0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(243,229,222,0.4)',
    paddingHorizontal: 24,
    paddingTop: 17,
    paddingBottom: 40,
  },
  cta: {
    backgroundColor: c.sageDark,
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: c.sageDark,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 16,
    elevation: 8,
  },
  ctaText: {
    fontFamily: f.displaySemi,
    fontSize: 17,
    color: '#FFFFFF',
    lineHeight: 25.5,
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
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,248,245,0.6)',
  },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
