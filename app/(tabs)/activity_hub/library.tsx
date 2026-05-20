import BottomNav from '@/components/bottom-nav';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

const COLORS = {
  background: '#FDF9F3',
  textDark: '#39382F',
  textMuted: '#9a9080',
  sage: '#526148',
  sageLight: '#A8B79B',
  card: '#FFFFFF',
  border: '#F5EFE6',
};

const CATEGORIES = ['ALL', 'Health', 'Nutrition', 'Mental Health', 'Recovery'];

const NEWS = [
  {
    id: '1',
    category: 'Health',
    title: 'Exercising for 30 minutes a day reduces the risk of cardiovascular disease by up to 35%.',
    summary: 'New research from Harvard University shows that just 30 minutes of light exercise each day can significantly improve cardiovascular health and extend lifespan..',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
    readTime: '4 minutes read',
    date: 'May 20, 2026',
    featured: true,
  },
  {
    id: '2',
    category: 'Nutrition',
    title: 'Post-workout protein: Should you drink it within 30 minutes or 2 hours?',
    summary: 'Many people believe they must consume protein immediately after working out, but what does science say about this "anabolic window"?',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
    readTime: '3 minutes read',
    date: 'May 19, 2026',
    featured: false,
  },
  {
    id: '3',
    category: 'Mental Health',
    title: 'Dopamine and workout motivation: Why do you give up after 2 weeks?',
    summary: 'Understanding the dopamine mechanism helps you build more sustainable workout habits than any diet plan.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    readTime: '5 minutes read',
    date: 'May 18, 2026',
    featured: false,
  },
  {
    id: '4',
    category: 'Recovery',
    title: 'Getting enough sleep is more important than adding one more workout',
    summary: 'While you sleep, your body produces growth hormone, rebuilds muscle, and strengthens motor memory. Lack of sleep can ruin all your training efforts..',
    image: 'https://images.unsplash.com/photo-1520206183501-b80df61043c2?auto=format&fit=crop&w=800&q=80',
    readTime: '4 minutes read',
    date: 'May 17, 2026',
    featured: false,
  },
  {
    id: '5',
    category: 'Health',
    title: 'Zone 2 Training: The Secret to Effective Cardio for Elite Athletes',
    summary: 'Training in Zone 2, at 60-70% of your maximum heart rate, helps increase mitochondria, improve VO2 max, and burn fat more effectively than HIIT over the long term.',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
    readTime: '6 minutes read',
    date: '16 May, 2026',
    featured: false,
  },
  {
    id: '6',
    category: 'Nutrition',
    title: 'Creatine: The Safest and Most Effective Supplement for Athletes',
    summary: 'With over 500 clinical studies, creatine monohydrate has been proven to increase strength, muscle mass, and even improve cognitive function.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    readTime: '4 minutes read',
    date: '15 May, 2026',
    featured: false,
  },
  {
    id: '7',
    category: 'Mental Health',
    title: 'Cold shower and mental health: Fact or trend?',
    summary: 'Cold showers can increase norepinephrine by up to 300%, improve mood, and enhance stress resilience. But do you need to do this every day?',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80',
    readTime: '3 minutes read',
    date: '14 May, 2026',
    featured: false,
  },
  {
    id: '8',
    category: 'Recovery',
    title: 'Foam rolling: Is it really effective?',
    summary: 'Research shows that foam rolling can reduce DOMS pain by up to 30% and improve temporary range of motion. This is the correct way to use it.',
    image: 'https://images.unsplash.com/photo-1518611012118-29a7d63d0c24?auto=format&fit=crop&w=800&q=80',
    readTime: '3 minutes read',
    date: '13 May, 2026',
    featured: false,
  },
];

export default function LibraryNews() {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const filtered = activeCategory === 'ALL'
    ? NEWS
    : NEWS.filter(n => n.category === activeCategory);

  const featured = filtered.find(n => n.featured) || filtered[0];
  const rest = filtered.filter(n => n.id !== featured?.id);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>LIBRARY</Text>
          <Text style={styles.headline}>Health Knowledge.</Text>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterBtn, activeCategory === cat && styles.filterBtnActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.filterText, activeCategory === cat && styles.filterTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Article */}
        {featured && (
          <View style={styles.featuredCard}>
            <Image source={{ uri: featured.image }} style={styles.featuredImage} resizeMode="cover" />
            <View style={styles.featuredOverlay}>
              <View style={styles.categoryTag}>
                <Text style={styles.categoryTagText}>{featured.category.toUpperCase()}</Text>
              </View>
              <Text style={styles.featuredTitle}>{featured.title}</Text>
              <View style={styles.featuredMeta}>
                <Feather name="clock" size={12} color="rgba(253,249,243,0.8)" />
                <Text style={styles.featuredMetaText}>{featured.readTime}</Text>
                <Text style={styles.featuredMetaText}>• {featured.date}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Article Count */}
        <View style={styles.countRow}>
          <Text style={styles.countText}>{filtered.length} articles</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Article List */}
        {rest.map((article, index) => (
          <TouchableOpacity key={article.id} activeOpacity={0.8}>
            {index % 3 === 0 ? (
              // Card lớn có ảnh
              <View style={styles.articleCardLarge}>
                <Image
                  source={{ uri: article.image }}
                  style={styles.articleImageLarge}
                  resizeMode="cover"
                />
                <View style={styles.articleBody}>
                  <View style={styles.articleMeta}>
                    <View style={[styles.catBadge, { backgroundColor: getCatColor(article.category) }]}>
                      <Text style={styles.catBadgeText}>{article.category}</Text>
                    </View>
                    <Text style={styles.articleDate}>{article.date}</Text>
                  </View>
                  <Text style={styles.articleTitle}>{article.title}</Text>
                  <Text style={styles.articleSummary} numberOfLines={2}>
                    {article.summary}
                  </Text>
                  <View style={styles.articleFooter}>
                    <Feather name="clock" size={12} color={COLORS.textMuted} />
                    <Text style={styles.readTime}>{article.readTime}</Text>
                  </View>
                </View>
              </View>
            ) : (
              // Card nhỏ ngang
              <View style={styles.articleCardSmall}>
                <Image
                  source={{ uri: article.image }}
                  style={styles.articleImageSmall}
                  resizeMode="cover"
                />
                <View style={styles.articleBodySmall}>
                  <View style={[styles.catBadge, { backgroundColor: getCatColor(article.category) }]}>
                    <Text style={styles.catBadgeText}>{article.category}</Text>
                  </View>
                  <Text style={styles.articleTitleSmall} numberOfLines={2}>
                    {article.title}
                  </Text>
                  <View style={styles.articleFooter}>
                    <Feather name="clock" size={11} color={COLORS.textMuted} />
                    <Text style={styles.readTime}>{article.readTime}</Text>
                  </View>
                </View>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Bottom tip card */}
        <View style={styles.tipCard}>
          <Text style={styles.tipEmoji}>💡</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Today's Tip</Text>
            <Text style={styles.tipText}>
              Drinking 500ml of water upon waking up can boost your metabolism by 30% within the first 1.5 hours.
            </Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

function getCatColor(category: string): string {
  const map: Record<string, string> = {
    'Health': '#A8C5A040',
    'Nutrition': '#F0C04040',
    'Mental Health': '#B5C8E840',
    'Recovery': '#D4A5A540',
  };
  return map[category] || '#EBE7DE';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: 24, paddingTop: 40 },

  // Header
  header: { marginBottom: 24 },
  greeting: {
    fontSize: 12, letterSpacing: 1.5, color: COLORS.textMuted,
    fontWeight: '700', marginBottom: 8,
  },
  headline: {
    fontSize: 34, fontWeight: '700', color: COLORS.textDark, lineHeight: 40,
  },

  // Filter
  filterRow: { gap: 10, marginBottom: 28, paddingBottom: 4 },
  filterBtn: {
    paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 20, backgroundColor: '#F2EBEB',
  },
  filterBtnActive: { backgroundColor: COLORS.sage },
  filterText: { fontSize: 14, fontWeight: '600', color: COLORS.textDark },
  filterTextActive: { color: '#FDF9F3' },

  // Featured
  featuredCard: {
    height: 420, borderRadius: 28, overflow: 'hidden', marginBottom: 28,
  },
  featuredImage: { width: '100%', height: '100%' },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
    justifyContent: 'flex-end', padding: 28,
  },
  categoryTag: {
    backgroundColor: COLORS.sage, paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 20, alignSelf: 'flex-start', marginBottom: 12,
  },
  categoryTagText: { color: '#FDF9F3', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  featuredTitle: {
    fontSize: 26, fontWeight: '700', color: '#FDF9F3', lineHeight: 32, marginBottom: 12,
  },
  featuredMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  featuredMetaText: { color: 'rgba(253,249,243,0.8)', fontSize: 12, fontWeight: '600' },

  // Count row
  countRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  countText: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 1 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },

  // Article Card Large
  articleCardLarge: {
    backgroundColor: COLORS.card, borderRadius: 24, overflow: 'hidden',
    marginBottom: 16, borderWidth: 1, borderColor: COLORS.border,
  },
  articleImageLarge: { width: '100%', height: 200 },
  articleBody: { padding: 20 },
  articleMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  catBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  catBadgeText: { fontSize: 10, fontWeight: '700', color: COLORS.textDark },
  articleDate: { fontSize: 11, color: COLORS.textMuted },
  articleTitle: {
    fontSize: 18, fontWeight: '700', color: COLORS.textDark, lineHeight: 24, marginBottom: 8,
  },
  articleSummary: { fontSize: 14, color: COLORS.textMuted, lineHeight: 20, marginBottom: 12 },
  articleFooter: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  readTime: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },

  // Article Card Small
  articleCardSmall: {
    flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: 20,
    overflow: 'hidden', marginBottom: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  articleImageSmall: { width: 110, height: 110 },
  articleBodySmall: { flex: 1, padding: 14, justifyContent: 'space-between' },
  articleTitleSmall: {
    fontSize: 15, fontWeight: '700', color: COLORS.textDark, lineHeight: 20, marginVertical: 8,
  },

  // Tip Card
  tipCard: {
    flexDirection: 'row', backgroundColor: '#F0F7EE', borderRadius: 20,
    padding: 20, gap: 14, alignItems: 'flex-start', marginTop: 8,
    borderWidth: 1, borderColor: '#A8C5A040',
  },
  tipEmoji: { fontSize: 28 },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textDark, marginBottom: 6 },
  tipText: { fontSize: 14, color: COLORS.textMuted, lineHeight: 20 },
});