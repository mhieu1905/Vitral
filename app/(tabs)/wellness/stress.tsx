import BottomNav from '@/components/bottom-nav';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type TabType = 'list' | 'calendar';

const ENTRIES = [
  {
    id: '1',
    type: 'reflection',
    badge: 'REFLECTION',
    badgeStyle: 'reflection',
    date: 'October 24, 2023',
    title: 'Quiet morning at the coastal path.',
    body: 'Today I felt an immense sense of clarity. The fog was rolling in over the cliffs and it felt like the world was holding its breath. I realized that my anxiety often stems from trying to see too far ahead.',
    mood: { emoji: '☀️', label: 'Calm & Bright' },
    hasImage: true,
    imageEmoji: '🌿',
    imageBg: ['#6A8A6A', '#8AAA7A'],
    tags: [],
    rightEmoji: '',
  },
  {
    id: '2',
    type: 'mood',
    badge: '',
    badgeStyle: '',
    date: 'October 22, 2023',
    title: 'Feeling a bit overwhelmed with work projects.',
    body: 'Tried a 10-minute box breathing exercise during lunch. It helped, but the pressure is still there. Need to prioritize sleep tonight.',
    mood: null,
    hasImage: false,
    imageEmoji: '',
    imageBg: [],
    tags: [],
    rightEmoji: '🌧️',
    avatars: ['🌿', '🌱'],
    avatarExtra: 2,
  },
  {
    id: '3',
    type: 'nature',
    badge: '',
    badgeStyle: 'highlighted',
    date: 'October 21, 2023',
    title: 'The garden is finally starting to bloom.',
    body: 'Grateful for the small things. The lavender smells amazing. Spent 30 minutes just sitting on the bench watching the bees.',
    mood: null,
    hasImage: false,
    imageEmoji: '',
    imageBg: [],
    tags: ['#GRATEFUL', '#NATURE'],
    rightEmoji: '🌿',
  },
  {
    id: '4',
    type: 'plain',
    badge: '',
    badgeStyle: 'plain',
    date: 'October 19, 2023',
    title: 'The beauty of doing nothing.',
    body: 'Decided to leave my phone in another room for the entire afternoon. The silence was uncomfortable at first, then liberating.',
    mood: null,
    hasImage: false,
    imageEmoji: '🌅',
    imageBg: ['#8B6914', '#C8A020'],
    tags: [],
    rightEmoji: '',
    quote: '"In the midst of movement and chaos, keep stillness inside of you"',
  },
];

export default function HistoryScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<TabType>('list');
  const [search, setSearch] = useState('');

  const filtered = ENTRIES.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuBtn}>
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>The Sanctuary</Text>
        <View style={styles.avatarSm}>
          <Text style={styles.avatarEmoji}>🧑‍💼</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>History</Text>
          <Text style={styles.heroSub}>Revisit your emotional landscape.</Text>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search thoughts..."
            placeholderTextColor="#9A9A8E"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'list' && styles.tabBtnActive]}
            onPress={() => setTab('list')}
          >
            <Text style={[styles.tabBtnText, tab === 'list' && styles.tabBtnTextActive]}>
              ☰ List View
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'calendar' && styles.tabBtnActive]}
            onPress={() => setTab('calendar')}
          >
            <Text style={[styles.tabBtnText, tab === 'calendar' && styles.tabBtnTextActive]}>
              📅 Calendar
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Entry 1: Reflection with image ── */}
        <View style={styles.card}>
          <View style={styles.entryMeta}>
            <View style={[styles.badge, styles.badgeReflection]}>
              <Text style={[styles.badgeText, styles.badgeTextReflection]}>REFLECTION</Text>
            </View>
            <Text style={styles.entryDate}>October 24, 2023</Text>
          </View>
          <Text style={styles.entryTitle}>Quiet morning at the coastal path.</Text>
          <Text style={styles.entryBody}>
            Today I felt an immense sense of clarity. The fog was rolling in over the cliffs
            and it felt like the world was holding its breath. I realized that my anxiety often
            stems from trying to see too far ahead.
          </Text>
          <View style={styles.moodPill}>
            <Text style={styles.moodEmoji}>☀️</Text>
            <Text style={styles.moodLabel}>Calm & Bright</Text>
          </View>
          {/* Image placeholder */}
          <View style={[styles.entryImg, { backgroundColor: '#7A9A7A' }]}>
            <Text style={styles.entryImgEmoji}>🌿</Text>
          </View>
        </View>

        {/* ── Weekly Rhythm Card ── */}
        <View style={styles.rhythmCard}>
          <Text style={styles.rhythmIcon}>📈</Text>
          <Text style={styles.rhythmTitle}>Weekly Rhythm</Text>
          <Text style={styles.rhythmDesc}>
            You've reached a state of "Flow" 4 times this week. Morning entries show 20%
            higher calmness scores.
          </Text>
          <Text style={styles.rhythmGoalLbl}>CONSISTENCY GOAL · 75%</Text>
          <View style={styles.rhythmBarWrap}>
            <View style={[styles.rhythmBar, { width: '75%' }]} />
          </View>
        </View>

        {/* ── Entry 2: Overwhelmed ── */}
        <View style={styles.card}>
          <View style={styles.entryMeta}>
            <Text style={styles.entryDate}>October 22, 2023</Text>
            <Text style={[styles.entryDate, { marginLeft: 'auto', fontSize: 18 }]}>🌧️</Text>
          </View>
          <Text style={styles.entryTitle}>Feeling a bit overwhelmed with work projects.</Text>
          <Text style={styles.entryBody}>
            Tried a 10-minute box breathing exercise during lunch. It helped, but the pressure
            is still there. Need to prioritize sleep tonight.
          </Text>
          <View style={styles.avatarCluster}>
            {['🌿', '🌱'].map((av, i) => (
              <View key={i} style={[styles.av, { marginLeft: i === 0 ? 0 : -6 }]}>
                <Text style={{ fontSize: 12 }}>{av}</Text>
              </View>
            ))}
            <Text style={styles.avExtra}>+2</Text>
          </View>
        </View>

        {/* ── Entry 3: Nature (highlighted) ── */}
        <View style={styles.highlightCard}>
          <View style={styles.entryMeta}>
            <Text style={styles.entryDate}>October 21, 2023</Text>
            <Text style={[styles.entryDate, { marginLeft: 'auto', fontSize: 18 }]}>🌿</Text>
          </View>
          <Text style={styles.entryTitle}>The garden is finally starting to bloom.</Text>
          <Text style={styles.entryBody}>
            Grateful for the small things. The lavender smells amazing. Spent 30 minutes just
            sitting on the bench watching the bees.
          </Text>
          <View style={styles.tagRow}>
            {['#GRATEFUL', '#NATURE'].map((t) => (
              <Text key={t} style={styles.tag}>{t}</Text>
            ))}
          </View>
        </View>

        {/* ── Image Banner ── */}
        <View style={styles.insightImg}>
          <Text style={styles.insightImgEmoji}>🌅</Text>
        </View>

        {/* ── Entry 4: Plain with quote ── */}
        <View style={styles.plainCard}>
          <Text style={[styles.entryDate, { marginBottom: 6 }]}>October 19, 2023</Text>
          <Text style={[styles.entryTitle, { fontSize: 22, marginBottom: 10 }]}>
            The beauty of doing nothing.
          </Text>
          <View style={styles.blockquote}>
            <Text style={styles.blockquoteText}>
              "In the midst of movement and chaos, keep stillness inside of you"
            </Text>
          </View>
          <Text style={[styles.entryBody, { marginTop: 10 }]}>
            Decided to leave my phone in another room for the entire afternoon. The silence was
            uncomfortable at first, then liberating.
          </Text>
        </View>

        {/* Load More */}
        <TouchableOpacity style={styles.loadMoreBtn}>
          <Text style={styles.loadMoreText}>Load older entries  ↓</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/wellness/journal')}
      >
        <Text style={styles.fabEmoji}>✏️</Text>
      </TouchableOpacity>
      {/* <BottomNav navigation={navigation} activeScreen="Wellness" /> */}
            <BottomNav/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F3EF' },

  topBar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10,
  },
  menuBtn: { padding: 4 },
  menuLine: { width: 18, height: 2, backgroundColor: '#2C5F2E', borderRadius: 2, marginVertical: 2 },
  topTitle: { fontSize: 15, fontWeight: '700', color: '#2C5F2E' },
  avatarSm: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#4A9B8E', alignItems: 'center', justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 17 },

  scroll: { paddingBottom: 90 },

  hero: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 12 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#1A2010', marginBottom: 4 },
  heroSub: { fontSize: 12, color: '#8A8A7E' },

  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 16, marginBottom: 10,
    backgroundColor: '#EDEAE3', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 9,
  },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, fontSize: 13, color: '#5A5A50' },

  tabRow: { flexDirection: 'row', gap: 8, marginHorizontal: 16, marginBottom: 14 },
  tabBtn: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1, borderColor: '#D0CCC4', backgroundColor: '#fff',
  },
  tabBtnActive: { backgroundColor: '#3A5A2A', borderColor: '#3A5A2A' },
  tabBtnText: { fontSize: 12, color: '#5A5A50', fontWeight: '500' },
  tabBtnTextActive: { color: '#fff' },

  /* Cards */
  card: {
    backgroundColor: '#fff', borderRadius: 16,
    marginHorizontal: 16, marginBottom: 12, padding: 14,
  },
  highlightCard: {
    backgroundColor: '#F0EDE5', borderRadius: 16,
    marginHorizontal: 16, marginBottom: 12, padding: 14,
  },
  plainCard: {
    marginHorizontal: 16, marginBottom: 12, paddingVertical: 14,
  },

  entryMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeReflection: { backgroundColor: '#E8F5EE' },
  badgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  badgeTextReflection: { color: '#3A7A3A' },
  entryDate: { fontSize: 11, color: '#9A9A8E' },
  entryTitle: { fontSize: 16, fontWeight: '700', color: '#1A2010', lineHeight: 22, marginBottom: 6 },
  entryBody: { fontSize: 12, color: '#5A5A50', lineHeight: 19, marginBottom: 10 },

  moodPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 20, backgroundColor: '#FFF8E0',
    borderWidth: 1, borderColor: '#F0E0A0',
    alignSelf: 'flex-start', marginBottom: 10,
  },
  moodEmoji: { fontSize: 14 },
  moodLabel: { fontSize: 11, fontWeight: '600', color: '#8A7020' },

  entryImg: {
    width: '100%', height: 130, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  entryImgEmoji: { fontSize: 40 },

  /* Weekly Rhythm */
  rhythmCard: {
    backgroundColor: '#FDECEA', borderRadius: 16,
    marginHorizontal: 16, marginBottom: 12, padding: 14,
  },
  rhythmIcon: { fontSize: 20, marginBottom: 6 },
  rhythmTitle: { fontSize: 15, fontWeight: '700', color: '#1A2010', marginBottom: 4 },
  rhythmDesc: { fontSize: 12, color: '#7A5A5A', lineHeight: 18, marginBottom: 10 },
  rhythmGoalLbl: { fontSize: 9, color: '#9A7070', letterSpacing: 0.8, marginBottom: 4 },
  rhythmBarWrap: { height: 4, backgroundColor: '#F0D8D8', borderRadius: 2, overflow: 'hidden' },
  rhythmBar: { height: '100%', backgroundColor: '#C06060', borderRadius: 2 },

  /* Avatar cluster */
  avatarCluster: { flexDirection: 'row', alignItems: 'center' },
  av: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#E8F0E8', borderWidth: 2, borderColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  avExtra: { fontSize: 11, color: '#7A8070', marginLeft: 6 },

  /* Tags */
  tagRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  tag: { fontSize: 10, color: '#5A7A5A', fontWeight: '700', letterSpacing: 0.5 },

  /* Insight image */
  insightImg: {
    marginHorizontal: 16, marginBottom: 12,
    height: 120, borderRadius: 16,
    backgroundColor: '#C8A020',
    alignItems: 'center', justifyContent: 'center',
  },
  insightImgEmoji: { fontSize: 48 },

  /* Blockquote */
  blockquote: {
    borderLeftWidth: 3, borderLeftColor: '#9A9A8E', paddingLeft: 12,
  },
  blockquoteText: { fontSize: 12, color: '#6A6A60', fontStyle: 'italic', lineHeight: 19 },

  /* Load more */
  loadMoreBtn: {
    alignItems: 'center', justifyContent: 'center', paddingVertical: 16,
  },
  loadMoreText: { fontSize: 13, fontWeight: '600', color: '#3A5A2A' },

  /* FAB */
  fab: {
    position: 'absolute', bottom: 20, right: 16,
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: '#3A5A2A',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#3A5A2A', shadowOpacity: 0.4,
    shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabEmoji: { fontSize: 22 },
});