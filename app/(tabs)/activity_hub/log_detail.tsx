import BottomNav from '@/components/bottom-nav';
import { getExercises, logActivity } from '@/services/activityService';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LogDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const activityType = (params.type as string) || 'Running';

  const [duration, setDuration] = useState(30)
  const [intensity, setIntensity] = useState('medium')
  const [loading, setLoading] = useState(false)
  const [calories, setCalories] = useState(0)
  const [exercises, setExercises] = useState<any[]>([])
  const [loadingExercises, setLoadingExercises] = useState(false)

  // Load bài tập khi intensity thay đổi
  useEffect(() => {
    loadExercises(intensity)
    estimateCalories(duration, intensity)
  }, [])

  const loadExercises = async (inten: string) => {
    setLoadingExercises(true)
    try {
      const data = await getExercises(activityType, inten)
      setExercises(data.exercises || [])
    } catch (e) {
      console.log('Error loading exercises:', e)
      setExercises([])
    } finally {
      setLoadingExercises(false)
    }
  }

  const estimateCalories = (dur: number, inten: string) => {
    const met: Record<string, number> = {
      Running: 9.0, Cycling: 7.5, Swimming: 8.0,
      Walking: 3.5, Gym: 6.0, Yoga: 3.0,
    }
    const multiplier: Record<string, number> = {
      low: 0.8, medium: 1.0, high: 1.3
    }
    const base = met[activityType] || 5.0
    const cal = base * (multiplier[inten] || 1.0) * 70 * (dur / 60)
    setCalories(Math.round(cal))
  }

  const changeDuration = (delta: number) => {
    const newDur = Math.max(5, duration + delta)
    setDuration(newDur)
    estimateCalories(newDur, intensity)
  }

  const changeIntensity = (inten: string) => {
    setIntensity(inten)
    estimateCalories(duration, inten)
    loadExercises(inten)  // ← Load bài tập mới khi đổi intensity
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await logActivity({
        activity_type: activityType,
        duration,
        intensity,
        notes: ''
      })
      Alert.alert('✅ Success!', `Activity saved: ${activityType} for ${duration} minutes!`, [
        { text: 'OK', onPress: () => router.replace('/activity_hub') }
      ])
    } catch (error) {
      Alert.alert('❌ Error', 'Unable to save activity. Try again.!')
    } finally {
      setLoading(false)
    }
  }

  const intensityColor = {
    low: '#A8C5A0',
    medium: '#F0C040',
    high: '#D4A5A5',
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={24} color="#39382F" />
          </TouchableOpacity>
          <Text style={styles.headline}>{activityType}</Text>
          <Text style={styles.subheadline}>Set up your workout</Text>
        </View>

        {/* Calories Preview */}
        <View style={styles.caloriesCard}>
          <MaterialCommunityIcons name="fire" size={32} color="#526148" />
          <Text style={styles.caloriesValue}>{calories}</Text>
          <Text style={styles.caloriesLabel}>ESTIMATED KCAL</Text>
        </View>

        {/* Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DURATION</Text>
          <View style={styles.durationRow}>
            <TouchableOpacity style={styles.durationBtn} onPress={() => changeDuration(-5)}>
              <Feather name="minus" size={24} color="#39382F" />
            </TouchableOpacity>
            <View style={styles.durationDisplay}>
              <Text style={styles.durationValue}>{duration}</Text>
              <Text style={styles.durationUnit}>minutes</Text>
            </View>
            <TouchableOpacity style={styles.durationBtn} onPress={() => changeDuration(5)}>
              <Feather name="plus" size={24} color="#39382F" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Intensity */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>INTENSITY</Text>
          <View style={styles.intensityRow}>
            {[
              { key: 'low', label: 'LOW' },
              { key: 'medium', label: 'MEDIUM' },
              { key: 'high', label: 'HIGH' },
            ].map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.intensityBtn,
                  intensity === item.key && {
                    ...styles.intensityBtnActive,
                    backgroundColor: intensityColor[item.key] + '50'
                  }
                ]}
                onPress={() => changeIntensity(item.key)}
              >
                <Text style={[
                  styles.intensityText,
                  intensity === item.key && styles.intensityTextActive
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Exercise List */}
        <View style={styles.section}>
          <View style={styles.exerciseHeader}>
            <Text style={styles.sectionLabel}>EXERCISE LIST</Text>
            <View style={[styles.intensityBadge, { backgroundColor: intensityColor[intensity] + '40' }]}>
              <Text style={[styles.intensityBadgeText, { color: '#39382F' }]}>
                {intensity === 'low' ? 'LOW' : intensity === 'medium' ? 'MEDIUM' : 'HIGH'}
              </Text>
            </View>
          </View>

          {loadingExercises ? (
            <View style={styles.loadingBox}>
              <Text style={styles.loadingText}>Loading exercises...</Text>
            </View>
          ) : exercises.length === 0 ? (
            <View style={styles.emptyBox}>
              <MaterialCommunityIcons name="dumbbell" size={36} color="#EBE7DE" />
              <Text style={styles.emptyText}>There are no exercises for this section yet.</Text>
            </View>
          ) : (
            exercises.map((ex, index) => (
              <View key={ex.id} style={styles.exerciseCard}>
                {/* Số thứ tự */}
                <View style={styles.exerciseIndex}>
                  <Text style={styles.exerciseIndexText}>{index + 1}</Text>
                </View>

                <View style={styles.exerciseContent}>
                  <View style={styles.exerciseTop}>
                    <Text style={styles.exerciseName}>{ex.exercise_name}</Text>
                    <View style={styles.exerciseBadgeRow}>
                      {/* Sets */}
                      {ex.sets && (
                        <View style={styles.badge}>
                          <MaterialCommunityIcons name="repeat" size={12} color="#526148" />
                          <Text style={styles.badgeText}>{ex.sets} Set</Text>
                        </View>
                      )}
                      {/* Reps */}
                      {ex.reps && (
                        <View style={[styles.badge, { backgroundColor: '#F2EBEB' }]}>
                          <MaterialCommunityIcons name="counter" size={12} color="#8C6464" />
                          <Text style={[styles.badgeText, { color: '#8C6464' }]}>{ex.reps}</Text>
                        </View>
                      )}
                      {/* Rest */}
                      {ex.rest_seconds > 0 && (
                        <View style={[styles.badge, { backgroundColor: '#EBF0F5' }]}>
                          <MaterialCommunityIcons name="timer-outline" size={12} color="#5A7BAE" />
                          <Text style={[styles.badgeText, { color: '#5A7BAE' }]}>
                            {ex.rest_seconds}s break
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Description */}
                  {ex.description && (
                    <Text style={styles.exerciseDesc}>{ex.description}</Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Loading...' : 'Save Activity'}
          </Text>
          {!loading && <Feather name="check-circle" size={20} color="#FDF9F3" style={{ marginLeft: 8 }} />}
        </TouchableOpacity>

        <View style={{ height: 140 }} />
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF9F3' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 40 },
  header: { marginBottom: 32 },
  backBtn: { marginBottom: 16 },
  headline: { fontSize: 42, fontWeight: '800', color: '#39382F', lineHeight: 48, marginBottom: 8 },
  subheadline: { fontSize: 16, color: '#9a9080' },

  caloriesCard: {
    backgroundColor: '#F2EBEB', borderRadius: 24,
    padding: 32, alignItems: 'center', marginBottom: 32,
  },
  caloriesValue: { fontSize: 72, fontWeight: '800', color: '#39382F', marginTop: 8 },
  caloriesLabel: { fontSize: 12, letterSpacing: 1.5, color: '#9a9080', fontWeight: '700', marginTop: 4 },

  section: { marginBottom: 32 },
  sectionLabel: { fontSize: 12, letterSpacing: 1.5, color: '#9a9080', fontWeight: '700', marginBottom: 16 },

  durationRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFF7F2', borderRadius: 20, padding: 16,
  },
  durationBtn: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: '#F2EBEB', justifyContent: 'center', alignItems: 'center',
  },
  durationDisplay: { alignItems: 'center' },
  durationValue: { fontSize: 48, fontWeight: '800', color: '#39382F' },
  durationUnit: { fontSize: 16, color: '#9a9080', fontWeight: '600' },

  intensityRow: { flexDirection: 'row', backgroundColor: '#F2EBEB', borderRadius: 16, padding: 4, gap: 4 },
  intensityBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: 12 },
  intensityBtnActive: { backgroundColor: '#D4E4CC' },
  intensityText: { fontSize: 11, fontWeight: '700', color: '#9a9080', letterSpacing: 0.5 },
  intensityTextActive: { color: '#39382F', fontWeight: '800' },

  // Exercise section
  exerciseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  intensityBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  intensityBadgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },

  loadingBox: { padding: 32, alignItems: 'center' },
  loadingText: { color: '#9a9080', fontSize: 15 },
  emptyBox: { padding: 32, alignItems: 'center', backgroundColor: '#FFF7F2', borderRadius: 20 },
  emptyText: { color: '#9a9080', fontSize: 15, marginTop: 12 },

  exerciseCard: {
    flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 20,
    padding: 16, marginBottom: 12, gap: 14,
    shadowColor: '#39382F', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    borderWidth: 1, borderColor: '#F5EFE6',
  },
  exerciseIndex: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: '#F2EBEB', justifyContent: 'center', alignItems: 'center',
    marginTop: 2,
  },
  exerciseIndexText: { fontSize: 14, fontWeight: '800', color: '#526148' },
  exerciseContent: { flex: 1 },
  exerciseTop: { marginBottom: 8 },
  exerciseName: { fontSize: 17, fontWeight: '700', color: '#39382F', marginBottom: 8 },
  exerciseBadgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#F0F7EE', paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 20,
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#526148' },
  exerciseDesc: { fontSize: 13, color: '#9a9080', lineHeight: 18 },

  saveButton: {
    backgroundColor: '#526148', flexDirection: 'row', paddingVertical: 20,
    borderRadius: 16, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#526148', shadowOpacity: 0.2, shadowRadius: 10, elevation: 6,
  },
  saveButtonDisabled: { backgroundColor: '#9a9080' },
  saveButtonText: { color: '#FDF9F3', fontSize: 18, fontWeight: '700' },
});