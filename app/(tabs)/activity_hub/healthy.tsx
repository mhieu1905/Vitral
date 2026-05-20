import BottomNav from '@/components/bottom-nav';
import { getActivityHistory, getTodaySummary } from '@/services/activityService';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function RecoveryAndBiometrics() {
  const [summary, setSummary] = useState({
    total_calories: 0,
    total_duration: 0,
    activity_count: 0,
  });
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [summaryData, historyData] = await Promise.all([
        getTodaySummary(),
        getActivityHistory(),
      ]);
      setSummary(summaryData);
      setHistory(historyData.data || []);
    } catch (e) {
      console.log('Lỗi:', e);
    } finally {
      setLoading(false);
    }
  };

  // Tính recovery score dựa trên data thật
  const recoveryScore = Math.min(
    50 + Math.round((summary.total_duration / 60) * 20),
    100
  );

  // Tính strain level
  const strainLevel = summary.total_calories > 400
    ? 'Cao' : summary.total_calories > 200
    ? 'Trung bình' : 'Thấp';

  // Lấy 7 activity gần nhất để vẽ chart
  const chartData = history.slice(0, 7).reverse();
  const maxCalories = Math.max(...chartData.map(a => a.calories_burned), 1);

  // Tính avg calories
  const avgCalories = history.length > 0
    ? Math.round(history.reduce((sum, a) => sum + a.calories_burned, 0) / history.length)
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SECTION 1: RECOVERY SCORE */}
        <View style={styles.recoveryCard}>
          <View style={styles.recoveryHeader}>
            <View>
              <Text style={styles.label}>TRẠNG THÁI</Text>
              <Text style={styles.headline}>Điểm phục hồi</Text>
            </View>
            <View style={[styles.scoreCircle, {
              borderColor: recoveryScore > 70 ? '#526148' : recoveryScore > 40 ? '#D4A020' : '#D4A5A5'
            }]}>
              <Text style={styles.scoreValue}>{loading ? '--' : recoveryScore}</Text>
            </View>
          </View>

          <Text style={styles.recoveryDesc}>
            {recoveryScore > 70
              ? 'Cơ thể bạn đang trong trạng thái tốt. Tiếp tục duy trì thói quen luyện tập!'
              : recoveryScore > 40
              ? 'Cơ thể đang phục hồi. Hãy nghỉ ngơi đủ giấc và uống đủ nước.'
              : 'Hôm nay chưa có hoạt động. Hãy bắt đầu với 30 phút đơn giản!'}
          </Text>

          <View style={styles.miniMetricsRow}>
            <View style={styles.miniCard}>
              <Text style={styles.miniLabel}>CĂNG THẲNG</Text>
              <Text style={styles.miniValue}>{loading ? '--' : strainLevel}</Text>
            </View>
            <View style={styles.miniCard}>
              <Text style={styles.miniLabel}>THỜI GIAN TẬP</Text>
              <Text style={styles.miniValue}>{loading ? '--' : `${summary.total_duration} phút`}</Text>
            </View>
            <View style={styles.miniCard}>
              <Text style={styles.miniLabel}>SỐ BUỔI</Text>
              <Text style={styles.miniValue}>{loading ? '--' : `${summary.activity_count} buổi`}</Text>
            </View>
          </View>
        </View>

        {/* SECTION 2: ACTIVITY TRENDS — data thật */}
        <View style={styles.trendsCard}>
          <View style={styles.trendsHeader}>
            <View>
              <Text style={styles.sectionTitle}>Xu hướng hoạt động</Text>
              <Text style={styles.sectionSubtitle}>{history.length} buổi gần nhất</Text>
            </View>
            <View style={styles.avgContainer}>
              <Text style={styles.avgValue}>{loading ? '--' : avgCalories}</Text>
              <Text style={styles.avgLabel}>CALO TRUNG BÌNH</Text>
            </View>
          </View>

          {/* Bar Chart thật */}
          <View style={styles.chartContainer}>
            {loading ? (
              <Text style={{ color: '#9a9080', alignSelf: 'center' }}>Đang tải...</Text>
            ) : chartData.length === 0 ? (
              <Text style={{ color: '#9a9080', alignSelf: 'center' }}>Chưa có dữ liệu</Text>
            ) : (
              chartData.map((activity, index) => {
                const barHeight = Math.max(
                  (activity.calories_burned / maxCalories) * 100, 10
                );
                const isLatest = index === chartData.length - 1;
                return (
                  <View key={activity.id} style={styles.barWrapper}>
                    <Text style={styles.barCalLabel}>
                      {activity.calories_burned}
                    </Text>
                    <View style={[
                      styles.bar,
                      { height: barHeight },
                      isLatest && styles.barActive
                    ]} />
                    <Text style={styles.dayText} numberOfLines={1}>
                      {activity.activity_type.slice(0, 3).toUpperCase()}
                    </Text>
                  </View>
                );
              })
            )}
          </View>
        </View>

        {/* SECTION 3: STATS GRID */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="fire" size={28} color="#D4A5A5" />
            <Text style={styles.statValue}>{loading ? '--' : summary.total_calories}</Text>
            <Text style={styles.statLabel}>KCAL HÔM NAY</Text>
            <View style={styles.statBar}>
              <View style={[styles.statBarFill, {
                width: `${Math.min((summary.total_calories / 500) * 100, 100)}%`,
                backgroundColor: '#D4A5A5'
              }]} />
            </View>
          </View>

          <View style={styles.statCard}>
            <MaterialCommunityIcons name="clock-outline" size={28} color="#B5C8E8" />
            <Text style={styles.statValue}>{loading ? '--' : summary.total_duration}</Text>
            <Text style={styles.statLabel}>PHÚT TẬP</Text>
            <View style={styles.statBar}>
              <View style={[styles.statBarFill, {
                width: `${Math.min((summary.total_duration / 60) * 100, 100)}%`,
                backgroundColor: '#B5C8E8'
              }]} />
            </View>
          </View>
        </View>

        {/* SECTION 4: RECENT ACTIVITIES */}
        <View style={styles.recentCard}>
          <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
          <Text style={styles.sectionSubtitle} style={{ marginBottom: 16 }}>
            Tổng {history.length} buổi đã ghi nhận
          </Text>

          {loading ? (
            <Text style={{ color: '#9a9080', textAlign: 'center', padding: 20 }}>Đang tải...</Text>
          ) : history.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="run" size={40} color="#EBE7DE" />
              <Text style={styles.emptyText}>Chưa có hoạt động nào</Text>
            </View>
          ) : (
            history.slice(0, 5).map((activity, index) => (
              <View key={activity.id} style={[
                styles.activityRow,
                index < 4 && { borderBottomWidth: 1, borderBottomColor: '#F5F2EB' }
              ]}>
                <View style={styles.activityLeft}>
                  <View style={[styles.activityIcon, {
                    backgroundColor: index % 2 === 0 ? '#A8C5A030' : '#D4A5A530'
                  }]}>
                    <MaterialCommunityIcons
                      name="run"
                      size={22}
                      color={index % 2 === 0 ? '#526148' : '#8C6464'}
                    />
                  </View>
                  <View>
                    <Text style={styles.activityName}>{activity.activity_type}</Text>
                    <Text style={styles.activityMeta}>
                      {activity.duration} phút • {activity.intensity}
                    </Text>
                  </View>
                </View>
                <View style={styles.activityRight}>
                  <Text style={styles.activityCal}>{activity.calories_burned}</Text>
                  <Text style={styles.activityCalUnit}>kcal</Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF9F3' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 40 },
  label: {
    fontSize: 10, letterSpacing: 1.5, color: '#9a9080', fontWeight: '700', marginBottom: 4,
  },
  headline: {
    fontSize: 28, fontFamily: 'serif', fontWeight: '700', color: '#39382F',
  },

  // Recovery Card
  recoveryCard: {
    backgroundColor: '#FFFFFF', borderRadius: 32, padding: 28,
    marginBottom: 20, shadowColor: '#39382F',
    shadowOpacity: 0.06, shadowRadius: 20, elevation: 5,
  },
  recoveryHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  scoreCircle: {
    width: 72, height: 72, borderRadius: 36,
    borderWidth: 3, justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#FDF9F3',
  },
  scoreValue: { fontSize: 26, fontWeight: '800', color: '#39382F' },
  recoveryDesc: { fontSize: 15, color: '#615E5B', lineHeight: 22, marginBottom: 24 },
  miniMetricsRow: { flexDirection: 'row', gap: 10 },
  miniCard: {
    flex: 1, backgroundColor: '#FFF7F2', borderRadius: 16, padding: 14,
  },
  miniLabel: {
    fontSize: 8, letterSpacing: 1, color: '#9a9080', fontWeight: '700', marginBottom: 6,
  },
  miniValue: { fontSize: 15, fontFamily: 'serif', fontWeight: '700', color: '#39382F' },

  // Trends Card
  trendsCard: {
    backgroundColor: '#F2EBEB', borderRadius: 32, padding: 28, marginBottom: 20,
  },
  trendsHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20, fontFamily: 'serif', fontWeight: '700', color: '#39382F', marginBottom: 4,
  },
  sectionSubtitle: { fontSize: 13, color: '#9a9080' },
  avgContainer: { alignItems: 'flex-end' },
  avgValue: { fontSize: 28, fontFamily: 'serif', fontWeight: '700', color: '#39382F' },
  avgLabel: { fontSize: 8, letterSpacing: 1, color: '#9a9080', fontWeight: '700' },
  chartContainer: {
    flexDirection: 'row', alignItems: 'flex-end',
    justifyContent: 'space-around', height: 130, marginBottom: 12,
  },
  barWrapper: { alignItems: 'center', gap: 4, flex: 1 },
  barCalLabel: { fontSize: 8, color: '#9a9080', fontWeight: '700' },
  bar: { width: 28, backgroundColor: '#EBE7DE', borderRadius: 6 },
  barActive: { backgroundColor: '#526148' },
  dayText: {
    fontSize: 8, fontWeight: '700', color: '#9a9080', textAlign: 'center',
  },

  // Stats Grid
  statsGrid: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20,
    alignItems: 'center', shadowColor: '#39382F',
    shadowOpacity: 0.04, shadowRadius: 10, elevation: 3,
  },
  statValue: {
    fontSize: 32, fontWeight: '800', color: '#39382F', marginTop: 8, marginBottom: 4,
  },
  statLabel: {
    fontSize: 9, letterSpacing: 1, color: '#9a9080', fontWeight: '700', marginBottom: 12,
  },
  statBar: {
    width: '100%', height: 4, backgroundColor: '#F5F2EB', borderRadius: 2,
  },
  statBarFill: { height: '100%', borderRadius: 2 },

  // Recent Activities
  recentCard: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24,
    shadowColor: '#39382F', shadowOpacity: 0.04, shadowRadius: 10, elevation: 3,
  },
  activityRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 14,
  },
  activityLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  activityIcon: {
    width: 44, height: 44, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  activityName: { fontSize: 16, fontWeight: '700', color: '#39382F', marginBottom: 2 },
  activityMeta: { fontSize: 12, color: '#9a9080' },
  activityRight: { alignItems: 'flex-end' },
  activityCal: { fontSize: 18, fontWeight: '700', color: '#526148' },
  activityCalUnit: { fontSize: 10, color: '#9a9080', fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingVertical: 32 },
  emptyText: { fontSize: 15, color: '#9a9080', marginTop: 12 },
});