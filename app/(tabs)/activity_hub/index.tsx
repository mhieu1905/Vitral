import BottomNav from '@/components/bottom-nav';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

/**
 * FILE PATH: app/(tabs)/activity_hub/index.tsx
 * ROLE: Detailed Activity Hub (5-Tab Navigation)
 * 
 * FIX: Added the 5-item custom bottom navigation bar and navigation logic.
 */

const { width } = Dimensions.get('window');

const COLORS = {
  background: '#FDF8F3',
  surface: '#FFFFFF',
  textDark: '#3D3530',
  textMuted: '#8C7B72',
  sage: '#4b6546',
  sageLight: '#A8C5A0',
  accent: '#D4A5A5',
  accentBlue: '#B5C8E8',
  border: '#F5EFE6',
};

export default function FullActivityHub() {
  const router = useRouter();
  const pathname = usePathname();

  // Helper to switch screens
  const navigateTo = (route: string) => {
    router.replace(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Vitality Score Section */}
        <View style={styles.scoreSection}>
          <View style={styles.scoreCircleContainer}>
            <View style={styles.outerCircle}>
               <View style={styles.innerCircle}>
                  <Text style={styles.scoreLabel}>VITALITY SCORE</Text>
                  <Text style={styles.scoreValue}>82%</Text>
                  <View style={styles.trendRow}>
                    <Feather name="trending-up" size={14} color={COLORS.sage} />
                    <Text style={styles.trendText}>+4% today</Text>
                  </View>
               </View>
            </View>
          </View>
        </View>

        {/* 2. Metric Grid */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <MaterialCommunityIcons name="shoe-print" size={18} color={COLORS.textMuted} />
              <Text style={styles.metricLabel}>STEPS</Text>
            </View>
            <Text style={styles.metricValue}>12.4k</Text>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: '70%', backgroundColor: COLORS.sage }]} />
            </View>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <MaterialCommunityIcons name="fire" size={18} color={COLORS.textMuted} />
              <Text style={styles.metricLabel}>KCAL</Text>
            </View>
            <Text style={styles.metricValue}>482</Text>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: '45%', backgroundColor: COLORS.accent }]} />
            </View>
          </View>
        </View>

        {/* 3. Suggested For You Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Suggested for You</Text>
            <TouchableOpacity><Text style={styles.seeAll}>EXPLORE</Text></TouchableOpacity>
          </View>

          <View style={styles.suggestedCard}>
             <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=800&q=80' }} 
                style={styles.suggestedImage} 
             />
             <View style={styles.durationTag}>
                <Text style={styles.durationText}>15 Min</Text>
             </View>
             <TouchableOpacity style={styles.cardFab} activeOpacity={0.8}>
                <Feather name="plus" size={20} color="#FDF8F3" />
             </TouchableOpacity>
          </View>
        </View>

        {/* 4. Recent Sessions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Sessions</Text>
            <TouchableOpacity><Text style={styles.seeAll}>SEE ALL</Text></TouchableOpacity>
          </View>

          <SessionItem 
            icon="run" 
            title="Outdoor Run" 
            subtitle="Yesterday • 5.2 km" 
            duration="32:15" 
            iconBg={COLORS.sageLight + '30'} 
            iconColor={COLORS.sage}
          />
          <SessionItem 
            icon="weight-lifter" 
            title="Strength Training" 
            subtitle="2 days ago • Full Body" 
            duration="45:00" 
            iconBg={COLORS.accent + '30'} 
            iconColor="#946262"
          />
          <SessionItem 
            icon="swim" 
            title="Evening Swim" 
            subtitle="Monday • 800m" 
            duration="20:45" 
            iconBg={COLORS.accentBlue + '30'} 
            iconColor="#5A7BAE"
          />
        </View>

        <View style={{ height: 160 }} />
      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity style={styles.fabMain} activeOpacity={0.8} onPress={() => navigateTo('/activity')}>
        <Feather name="plus" size={32} color="#FDF8F3" />
      </TouchableOpacity>

      {/* 5. UPDATED BOTTOM NAVIGATION (5 ITEMS) */}
      {/* <BottomNav navigation={navigation} activeScreen="Wellness" /> */}
                  <BottomNav/>
    </SafeAreaView>
  );
}

// Sub-component for Session Items
const SessionItem = ({ icon, title, subtitle, duration, iconBg, iconColor }) => (
  <View style={styles.sessionCard}>
    <View style={styles.sessionLeft}>
      <View style={[styles.sessionIconBox, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons name={icon} size={24} color={iconColor} />
      </View>
      <View>
        <Text style={styles.sessionTitle}>{title}</Text>
        <Text style={styles.sessionSubtitle}>{subtitle}</Text>
      </View>
    </View>
    <View style={styles.sessionRight}>
      <Text style={styles.sessionDuration}>{duration}</Text>
      <Text style={styles.durationLabel}>DURATION</Text>
    </View>
  </View>
);

// Sub-component for Nav Item
const NavItem = ({ icon, label, active = false, onPress, type = 'ionicons' }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress} activeOpacity={0.6}>
    <View style={[styles.navIconContainer, active && styles.navIconActive]}>
      {type === 'ionicons' ? (
        <Ionicons name={icon} size={22} color={active ? COLORS.textDark : COLORS.textMuted} />
      ) : (
        <MaterialCommunityIcons name={icon} size={22} color={active ? COLORS.textDark : COLORS.textMuted} />
      )}
    </View>
    <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  scoreSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  scoreCircleContainer: {
    width: 240,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 12,
    borderColor: '#EBE7DE',
    borderTopColor: COLORS.sage,
    borderRightColor: COLORS.sageLight,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
  },
  innerCircle: {
    alignItems: 'center',
    transform: [{ rotate: '-45deg' }],
  },
  scoreLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: COLORS.textMuted,
    fontWeight: '700',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.sage,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    marginBottom: 40,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'rgba(212, 165, 165, 0.08)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 165, 165, 0.15)',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 10,
    letterSpacing: 1,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  progressBg: {
    height: 4,
    backgroundColor: 'rgba(61, 53, 48, 0.05)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  seeAll: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1,
    textDecorationLine: 'underline',
  },
  suggestedCard: {
    height: 220,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  suggestedImage: {
    width: '100%',
    height: '100%',
  },
  durationTag: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    backgroundColor: 'rgba(61, 53, 48, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  durationText: {
    color: '#FDF8F3',
    fontSize: 12,
    fontWeight: '700',
  },
  cardFab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.sageLight,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.sage,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  sessionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sessionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  sessionIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  sessionSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  sessionRight: {
    alignItems: 'flex-end',
  },
  sessionDuration: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  durationLabel: {
    fontSize: 8,
    color: COLORS.textMuted,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  fabMain: {
    position: 'absolute',
    right: 24,
    bottom: 110,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.sage,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.sage,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 100,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FDF8F3FA',
    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderColor: 'rgba(61, 53, 48, 0.1)',
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  navIconContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  navIconActive: {
    backgroundColor: 'rgba(168, 197, 160, 0.2)',
  },
  navText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  navTextActive: {
    color: COLORS.textDark,
  },
});
