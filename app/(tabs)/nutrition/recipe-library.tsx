import { useRouter } from 'expo-router';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  FilterChip,
  NutritionTopBar,
  RecipeCard,
} from '@/components/nutrition';
import {
  RECIPE_LIBRARY_BEST_MATCHES,
  RECIPE_LIBRARY_CONTEXT,
  RECIPE_LIBRARY_DEFAULT_FILTER,
  RECIPE_LIBRARY_FILTERS,
} from '@/constants/nutrition';
import { nutritionColors as c, nutritionFonts as f } from '@/theme/nutrition';

export default function RecipeLibraryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<string>(RECIPE_LIBRARY_DEFAULT_FILTER);
  const [query, setQuery] = useState('');

  const cards = RECIPE_LIBRARY_BEST_MATCHES;

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.content, { paddingTop: insets.top + 92 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.contextHeader}>
          <Text style={s.contextLine1}>{RECIPE_LIBRARY_CONTEXT.dateLabel}</Text>
          <Text style={s.contextLine2}>{RECIPE_LIBRARY_CONTEXT.targetLabel}</Text>
        </View>

        <View style={s.searchBar}>
          <Search size={18} color={c.textMuted} strokeWidth={2} />
          <TextInput
            style={s.searchInput}
            placeholder={RECIPE_LIBRARY_CONTEXT.searchPlaceholder}
            placeholderTextColor={c.textMuted}
            value={query}
            onChangeText={setQuery}
          />
          <SlidersHorizontal size={16} color={c.textDim} strokeWidth={2} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.filtersRow}
          contentContainerStyle={s.filtersContent}
        >
          {RECIPE_LIBRARY_FILTERS.map((filter) => (
            <FilterChip
              key={filter.id}
              label={filter.label}
              active={activeFilter === filter.id}
              onPress={() => setActiveFilter(filter.id)}
            />
          ))}
        </ScrollView>

        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Best Matches</Text>
          <Pressable hitSlop={6}>
            <Text style={s.seeAll}>See all</Text>
          </Pressable>
        </View>

        <View style={s.grid}>
          {cards.map((recipe, idx) => (
            <View
              key={recipe.id}
              style={[s.gridCell, idx % 2 === 0 ? s.gridCellLeft : s.gridCellRight]}
            >
              <RecipeCard
                recipe={recipe}
                onPress={() => router.push('/nutrition/recipe-detail')}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <NutritionTopBar
        title="Choose Dinner Recipe"
        titleAlign="left"
        height={56}
        backgroundColor="rgba(255,248,245,0.92)"
        titleStyle={{ fontSize: 17, lineHeight: 25.5, letterSpacing: -0.2 }}
        onBack={() => router.dismissTo('/nutrition/select-day')}
        rightSlot={
          <Pressable hitSlop={10}>
            <SlidersHorizontal size={18} color={c.sageDark} strokeWidth={2} />
          </Pressable>
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingBottom: 64 },

  contextHeader: { gap: 3 },
  contextLine1: {
    fontFamily: f.displayMed,
    fontSize: 11,
    color: c.textMuted,
    lineHeight: 16.5,
  },
  contextLine2: {
    fontFamily: f.displayMed,
    fontSize: 11,
    color: c.textDim,
    lineHeight: 16.5,
  },

  searchBar: {
    marginTop: 16,
    height: 49,
    paddingHorizontal: 16,
    backgroundColor: c.cardCream,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: f.display,
    fontSize: 14,
    color: c.textDark,
    paddingVertical: 0,
  },

  filtersRow: { marginTop: 16, marginHorizontal: -24 },
  filtersContent: { paddingHorizontal: 24, gap: 8, paddingVertical: 4 },

  sectionHeader: {
    marginTop: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: f.displayBold,
    fontSize: 20,
    color: c.textDark,
    lineHeight: 28,
  },
  seeAll: {
    fontFamily: f.displayMed,
    fontSize: 11,
    color: c.sageDark,
    lineHeight: 16.5,
  },

  grid: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridCell: { width: '50%', marginBottom: 16 },
  gridCellLeft: { paddingRight: 8 },
  gridCellRight: { paddingLeft: 8 },
});
