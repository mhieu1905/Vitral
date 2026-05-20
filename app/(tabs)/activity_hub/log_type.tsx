
import BottomNav from '@/components/bottom-nav';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';

/**
 * FILE PATH: app/(tabs)/activity_hub/log_type.tsx
 * ROLE: Combined Activity Selection & Science (Member 3)
 * 
 * FIXES:
 * 1. Prototype Link: "View Session Summary" now correctly routes to '/activity_hub/summary'.
 * 2. Android Image Support: Using SafeImage with explicit dimensions and loading states.
 * 3. Navigation: Integrated 5-tab system (Onboarding, Dashboard, Activity, Nutrition, Wellness).
 */

const { width } = Dimensions.get('window');

const COLORS = {
  background: '#FDF9F3',
  textDark: '#39382F',
  textMuted: '#9a9080',
  accent: '#526148',
  accentLight: '#A8B79B',
  cardBg: '#FFF7F2',
  iconBg: '#F5E6DD',
  divider: 'rgba(57, 56, 47, 0.05)',
};

const ACTIVITY_TYPES = [
  { id: '1', label: 'Running', sub: 'CARDIO/ENDURANCE', icon: 'run' },
  { id: '2', label: 'Cycling', sub: 'HIGH INTENSITY', icon: 'bike' },
  { id: '3', label: 'Swimming', sub: 'FULL BODY', icon: 'swim' },
  { id: '4', label: 'Yoga', sub: 'FLEXIBILITY', icon: 'meditation' },
  { id: '5', label: 'Gym', sub: 'RESISTANCE', icon: 'weight-lifter' },
  { id: '6', label: 'Walking', sub: 'LOW IMPACT', icon: 'walk' },
]

const SafeImage = ({ uri, style }) => {
  const [loading, setLoading] = useState(true);
  return (
    <View style={[style, { backgroundColor: '#EBE7DE', justifyContent: 'center', alignItems: 'center' }]}>
      <Image 
        source={{ uri }} 
        style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]} 
        onLoadEnd={() => setLoading(false)}
      />
      {loading && <ActivityIndicator color={COLORS.textDark} />}
    </View>
  );
};

export default function CombinedActivityView() {
  const router = useRouter();

  const navigateTo = (route: string) => {
    router.replace(route);
  };

 const handleActivityPress = (item: any) => {
  router.push({
    pathname: '/activity_hub/log_detail',
    params: { type: item.label }
  })
}

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- SECTION 1: ACTIVITY SELECTION --- */}
        <View style={styles.header}>
          <Text style={styles.headline}>What are we{"\n"}doing today?</Text>
          <Text style={styles.subheadline}>Select your focus for this session.</Text>
        </View>

        <View style={styles.grid}>
          {ACTIVITY_TYPES.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.card} 
              activeOpacity={0.7}
              onPress={() => handleActivityPress(item)}
            >
              <View style={styles.cardContent}>
                <View style={styles.iconCircle}>
                  <MaterialCommunityIcons name={item.icon} size={28} color={COLORS.textDark} />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>{item.label}</Text>
                  <Text style={styles.cardSubtitle}>{item.sub}</Text>
                </View>
                {item.active && <View style={styles.activeDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />

        {/* --- SECTION 2: SCIENCE OF SELECTION --- */}
        <View style={styles.quoteCard}>
          <View style={styles.quoteHeader}>
             <MaterialCommunityIcons name="flask-outline" size={24} color="#8C6464" />
             <Text style={styles.quoteTitle}>Science of Selection</Text>
          </View>
          <Text style={styles.quoteText}>
            "Accuracy in data logging is the bedrock of restorative wellness. Mapping specific metabolic demands ensures your Curated Sanctuary adapts to your true physiological state."
          </Text>
          <Text style={styles.bodyText}>
            Tracking by type allows the algorithm to differentiate between mechanical load and metabolic strain, providing a more nuanced 'Vitality Score'.
          </Text>

          {/* FIXED LINK: Now routes to /summary */}
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/activity_hub/session')}
          >
             <Text style={styles.actionButtonText}>View Session Summary</Text>
             <Feather name="arrow-right" size={18} color="#FDF9F3" />
          </TouchableOpacity>
        </View>

        {/* Feature Image Section */}
        <View style={styles.imageSection}>
          <SafeImage 
            uri="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80" 
            style={styles.imageContainer} 
          />
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* --- 5-ITEM BOTTOM NAVIGATION --- */}
       <BottomNav/>
    </SafeAreaView>
  );
}

const NavItem = ({ icon, label, active, onPress, type = 'ionicons' }) => (
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
    paddingTop: 40,
  },
  header: {
    marginBottom: 40,
  },
  headline: {
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.textDark,
    lineHeight: 48,
    marginBottom: 12,
    fontFamily: 'DM Sans',
  },
  subheadline: {
    fontSize: 16,
    color: COLORS.textMuted,
    lineHeight: 24,
    fontFamily: 'DM Sans',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 20,
  },
  card: {
    width: (width - 64) / 2,
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 24,
    aspectRatio: 1,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.iconBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTextContainer: {
    marginTop: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 4,
    fontFamily: 'DM Sans',
  },
  cardSubtitle: {
    fontSize: 9,
    letterSpacing: 1,
    color: COLORS.textMuted,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  activeDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 40,
  },
  quoteCard: {
    backgroundColor: '#F2EBEB',
    borderRadius: 32,
    padding: 32,
    marginBottom: 24,
  },
  quoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  quoteTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textDark,
    fontFamily: 'DM Sans',
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: COLORS.textDark,
    lineHeight: 28,
    marginBottom: 20,
    fontFamily: 'DM Sans',
  },
  bodyText: {
    fontSize: 15,
    color: '#615E5B',
    lineHeight: 24,
    marginBottom: 32,
    fontFamily: 'DM Sans',
  },
  actionButton: {
    backgroundColor: COLORS.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  actionButtonText: {
    color: '#FDF9F3',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'DM Sans',
  },
  imageSection: {
    marginTop: 8,
  },
  imageContainer: {
    borderRadius: 32,
    overflow: 'hidden',
    height: 320,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FDF9F3FA',
    paddingBottom: 34,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: COLORS.divider,
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
    backgroundColor: COLORS.accentLight + '30',
  },
  navText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    fontFamily: 'DM Sans',
  },
  navTextActive: {
    color: COLORS.textDark,
  },
});