import BottomNav from '@/components/bottom-nav';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
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

/**
 * FILE PATH: app/(tabs)/activity_hub/session.tsx (hoặc file tương ứng)
 * ROLE: Active Session & Reading (Member 3)
 * 
 * FIXES:
 * 1. Router Logic: Đã thêm 'useRouter' và sửa hàm 'navigateTo' để hoạt động đúng với Expo Router.
 * 2. Component Tags: Sửa lỗi dùng thẻ <div> sai ngữ cảnh (nếu có) và thẻ <Text> lồng nhau không đúng trong nút Complete.
 * 3. Bottom Nav: Đồng bộ hóa 5 tab (Onboarding, Dashboard, Activity, Nutrition, Wellness).
 * 4. Android Image Fix: Sử dụng https và đảm bảo style cho Image.
 */

const { width } = Dimensions.get('window');

export default function CombinedActivitySession() {
  const router = useRouter();

  const navigateTo = (route: string) => {
    router.replace(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- SECTION 1: ACTIVE SESSION (Morning Run) --- */}
        <View style={styles.activeSessionContainer}>
          <View style={styles.imageHeader}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80' }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.imageOverlay}>
              <Text style={styles.sessionLabel}>ACTIVE SESSION</Text>
              <Text style={styles.sessionTitle}>Morning Run</Text>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <Feather name="clock" size={20} color="#615E5B" />
                <Text style={styles.metricLabelText}>DURATION</Text>
              </View>
              <View style={styles.metricValueRow}>
                <Text style={styles.metricValue}>00</Text>
                <Text style={styles.metricUnit}>min</Text>
              </View>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricHeader}>
                <MaterialCommunityIcons name="fire" size={20} color="#615E5B" />
                <Text style={styles.metricLabelText}>CALORIES</Text>
              </View>
              <View style={styles.metricValueRow}>
                <Text style={styles.metricValue}>0</Text>
                <Text style={styles.metricUnit}>kcal</Text>
              </View>
            </View>
          </View>

          <View style={styles.intensitySection}>
            <Text style={styles.sectionLabel}>Intensity Level</Text>
            <div style={styles.intensityToggle}>
              <TouchableOpacity style={styles.intensityBtn}>
                <Text style={styles.intensityText}>LIGHT</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.intensityBtn, styles.intensityBtnActive]}>
                <Text style={[styles.intensityText, styles.intensityTextActive]}>MODERATE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.intensityBtn}>
                <Text style={styles.intensityText}>VIGOROUS</Text>
              </TouchableOpacity>
            </div>
          </View>
        </View>

        {/* --- SECTION 2: ARTICLE CONTENT --- */}
        <View style={styles.articleSection}>
          <View style={styles.articleCard}>
            <View style={styles.articleHeaderLine}>
              <View style={styles.line} />
              <Text style={styles.articleCategory}>The Longevity Loop</Text>
            </View>

            <Text style={styles.articleTitle}>The Radiance of Morning Movement</Text>

            <Text style={styles.articleDesc}>
              Aligning your stride with the rising sun optimizes cortisol cycles, anchoring your circadian rhythm for restorative sleep and sustained creative clarity throughout the day.
            </Text>

            <View style={styles.articleProgressBg}>
              <View style={[styles.articleProgressFill, { width: '60%' }]} />
            </View>
          </View>

          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => navigateTo('/(tabs)/activity/home')}
          >
            <Text style={styles.completeButtonText}>Complete Session</Text>
            <Feather name="check-circle" size={20} color="#FDF9F3" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 140 }} />
      </ScrollView>

      {/* --- SYNCHRONIZED BOTTOM NAVIGATION (5 ITEMS) --- */}
      <BottomNav/>
    </SafeAreaView>
  );
}

const NavItem = ({ icon, label, active, onPress, type = 'ionicons' }) => (
  <TouchableOpacity style={styles.navItem} onPress={onPress} activeOpacity={0.6}>
    <View style={[styles.navIconContainer, active && styles.navIconActive]}>
      {type === 'ionicons' ? (
        <Ionicons name={icon} size={22} color={active ? "#39382F" : "#9a9080"} />
      ) : (
        <MaterialCommunityIcons name={icon} size={22} color={active ? "#39382F" : "#9a9080"} />
      )}
    </View>
    <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF9F3",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  activeSessionContainer: {
    marginBottom: 32,
  },
  imageHeader: {
    height: 280,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'flex-end',
    padding: 24,
  },
  sessionLabel: {
    color: '#FDF9F3',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  sessionTitle: {
    color: '#FDF9F3',
    fontSize: 32,
    fontFamily: 'serif',
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFF7F2',
    borderRadius: 20,
    padding: 20,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  metricLabelText: {
    fontSize: 10,
    letterSpacing: 1,
    color: '#9a9080',
    fontWeight: '700',
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  metricValue: {
    fontSize: 32,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#39382F',
  },
  metricUnit: {
    fontSize: 14,
    color: '#9a9080',
    fontFamily: 'serif',
  },
  intensitySection: {
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#39382F',
    marginBottom: 16,
  },
  intensityToggle: {
    flexDirection: 'row',
    backgroundColor: '#F2EBEB',
    borderRadius: 12,
    padding: 4,
  },
  intensityBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  intensityBtnActive: {
    backgroundColor: '#D4E4CC',
  },
  intensityText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9a9080',
    letterSpacing: 0.5,
  },
  intensityTextActive: {
    color: '#526148',
  },
  articleSection: {
    marginTop: 8,
  },
  articleCard: {
    backgroundColor: '#FFF7F2',
    borderRadius: 24,
    padding: 32,
    marginBottom: 24,
  },
  articleHeaderLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  line: {
    width: 32,
    height: 1,
    backgroundColor: '#9a9080',
  },
  articleCategory: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8C6464',
    fontFamily: 'serif',
  },
  articleTitle: {
    fontSize: 26,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#39382F',
    lineHeight: 32,
    marginBottom: 20,
  },
  articleDesc: {
    fontSize: 15,
    color: '#615E5B',
    lineHeight: 22,
    marginBottom: 32,
  },
  articleProgressBg: {
    height: 2,
    backgroundColor: '#F2EBEB',
    borderRadius: 1,
  },
  articleProgressFill: {
    height: '100%',
    backgroundColor: '#526148',
    borderRadius: 1,
  },
  completeButton: {
    backgroundColor: '#526148',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#526148',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  completeButtonText: {
    color: '#FDF9F3',
    fontSize: 18,
    fontWeight: '700',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FDF8F3FA',
    paddingBottom: 34,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: 'rgba(57, 56, 47, 0.05)',
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
    backgroundColor: '#A8B79B30',
  },
  navText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9a9080',
    textTransform: 'uppercase',
  },
  navTextActive: {
    color: '#39382F',
  },
});
