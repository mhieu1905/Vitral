import BottomNav from '@/components/bottom-nav';
import { useRouter } from 'expo-router';

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Design Tokens (từ Figma của bạn) ───────────────────────────────────────
const COLORS = {
  background: '#F5F4F0',
  cardGreen:  '#D4E8C2',
  cardPink:   '#F5C4C4',
  cardBlue:   '#C5E2E8',
  cardBeige:  '#E8DFC5',
  white:      '#FFFFFF',
  textDark:   '#2C2C2A',
  textMuted:  '#888780',
  textHint:   '#B4B2A9',
  accent:     '#3B6D11',
};

// ─── Types ───────────────────────────────────────────────────────────────────
interface QuickCardProps {
  emoji: string;
  title: string;
  subtitle: string;
  bgColor: string;
  textColor: string;
  subtitleColor: string;
  onPress: () => void;
}

interface NavItemProps {
  emoji: string;
  label: string;
  active?: boolean;
  onPress?: () => void;
}

// ─── Sub-components ──────────────────────────────────────────────────────────
const QuickCard: React.FC<QuickCardProps> = ({
  emoji, title, subtitle, bgColor, textColor, subtitleColor, onPress,
}) => (
  <TouchableOpacity
    style={[styles.quickCard, { backgroundColor: bgColor }]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={styles.quickCardEmoji}>{emoji}</Text>
    <Text style={[styles.quickCardTitle, { color: textColor }]}>{title}</Text>
    <Text style={[styles.quickCardSub, { color: subtitleColor }]}>{subtitle}</Text>
  </TouchableOpacity>
);

const NavItem: React.FC<NavItemProps> = ({ emoji, label, active, onPress }) => (
  <TouchableOpacity 
    style={styles.navItem} 
    activeOpacity={0.7}
    onPress={onPress} // ← THÊM DÒNG NÀY
  >
    <Text style={styles.navEmoji}>{emoji}</Text>
    <Text style={[styles.navLabel, active && styles.navLabelActive]}>
      {label}
    </Text>
    
  </TouchableOpacity>
);

// ─── Main Screen ─────────────────────────────────────────────────────────────
const HomeScreen: React.FC = () => {

const router = useRouter(); // ← thêm dòng này

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.dateText}>TUESDAY, JAN 14</Text>
          <Text style={styles.greeting}>Good Morning</Text>
          <Text style={styles.quote}>
            "Nature does not hurry, yet everything is accomplished."
          </Text>
        </View>

        {/* Quick Access Grid */}
        <View style={styles.grid}>
          <QuickCard
            emoji="🏠"
            title="Stress-check"
            subtitle="Daily Overview"
            bgColor={COLORS.cardGreen}
            textColor="#3B6D11"
            subtitleColor="#639922"
            onPress={() => router.push('/(tabs)/wellness/stress')}
          />
          <QuickCard
            emoji="📔"
            title="Journal"
            subtitle="Reflections"
            bgColor={COLORS.cardPink}
            textColor="#993556"
            subtitleColor="#D4537E"
            onPress={() => router.push('/(tabs)/wellness/journal')}
          />
          <QuickCard
            emoji="🫁"
            title="Breather"
            subtitle="Mindfulness"
            bgColor={COLORS.cardBlue}
            textColor="#0C447C"
            subtitleColor="#185FA5"
            onPress={() => router.push('/(tabs)/wellness/breathing')}
          />
          <QuickCard
            emoji="👤"
            title="Profile"
            subtitle="Your Sanctuary"
            bgColor={COLORS.cardBeige}
            textColor="#5F5E5A"
            subtitleColor="#888780"
            onPress={() => router.push('/(tabs)/wellness/profile')}
          />
          <QuickCard
  emoji="✨"
  title="For You"
  subtitle="Recommendations"
  bgColor="#E8E0F0"
  textColor="#6B3FA0"
  subtitleColor="#9B7EC8"
  onPress={() => router.push('/(tabs)/wellness/recommend')}
/>
        </View>

        {/* Today's Focus Banner */}
        <View style={styles.focusCard}>
          <View style={styles.focusIcon}>
            <Text style={{ fontSize: 18 }}>⚡</Text>
          </View>
          <View style={styles.focusText}>
            <Text style={styles.focusTitle}>Today's Focus</Text>
            <Text style={styles.focusSubtitle}>Energy Recharge</Text>
            <Text style={styles.focusHint}>
              Optimal time for a 10 min breather at 2PM
            </Text>
          </View>
        </View>

        {/* Journal & Breathing shortcuts */}
       
      </ScrollView>

      {/* Bottom Navigation */}
      {/* Bottom Nav */}
      <BottomNav />
    </SafeAreaView>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F4F0',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },

  // Header
  header: {
    marginBottom: 20,
  },
  dateText: {
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  quote: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 20,
    fontStyle: 'italic',
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  quickCard: {
    width: '47%',
    borderRadius: 18,
    padding: 16,
    minHeight: 88,
  },
  quickCardEmoji: {
    fontSize: 22,
    marginBottom: 6,
  },
  quickCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  quickCardSub: {
    fontSize: 11,
  },

  // Focus card
  focusCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  focusIcon: {
    width: 42,
    height: 42,
    backgroundColor: '#FAEEDA',
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusText: {
    flex: 1,
  },
  focusTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 1,
  },
  focusSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  focusHint: {
    fontSize: 11,
    color: COLORS.textHint,
    lineHeight: 16,
  },

  // Shortcut row
  shortcutRow: {
    flexDirection: 'row',
    gap: 12,
  },
  shortcutCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  shortcutEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  shortcutTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  shortcutSub: {
    fontSize: 11,
    color: COLORS.textMuted,
  },

  // Bottom nav
  bottomNav: {
    backgroundColor: COLORS.white,
    borderTopWidth: 0.5,
    borderTopColor: '#E0DFDA',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingBottom: 20, // account for home indicator
  },
  navItem: {
    alignItems: 'center',
    gap: 3,
  },
  navEmoji: {
    fontSize: 20,
  },
  navLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  navLabelActive: {
    color: COLORS.accent,
    fontWeight: '600',
  },
});

export default HomeScreen;