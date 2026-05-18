import BottomNav from '@/components/bottom-nav';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../../../theme/colors';
import { getTodayMood, logMood, MOODS } from '../../../utils/moodService';

const moods = MOODS;

export default function WellnessScreen() {
  const router = useRouter();

  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingToday, setLoadingToday] = useState(true);

  // Load mood hôm nay khi mở màn hình
  useEffect(() => {
    (async () => {
      try {
        const today = await getTodayMood();

        if (today) {
          setSelectedMood(today.mood_index);
        }
      } catch (e) {
        // chưa log mood hôm nay → bỏ qua
      } finally {
        setLoadingToday(false);
      }
    })();
  }, []);

  // Chọn mood và tự động lưu
  const handleMoodSelect = useCallback(
    async (index: number) => {
      if (saving) return;

      setSelectedMood(index);
      setSaving(true);

      try {
        await logMood(index);
      } catch (err: any) {
        Alert.alert('Lỗi', err.message ?? 'Không lưu được mood');
      } finally {
        setSaving(false);
      }
    },
    [saving]
  );

  // Loading khi đang lấy mood hôm nay
  if (loadingToday) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator color="#A8C5A0" size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header row */}
        <View style={styles.topRow}>
          <View>
            <Text style={styles.greetingSub}>Good morning</Text>
            <Text style={styles.greetingTitle}>
              How are you today?
            </Text>
          </View>

          <View style={styles.avatar} />
        </View>

        {/* Mood chips */}
        <View style={styles.moodRow}>
          {moods.map((m, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.moodChip,
                selectedMood === i && styles.moodChipSel,
              ]}
              onPress={() => handleMoodSelect(i)}
              activeOpacity={0.8}
              disabled={saving}
            >
              <Text style={styles.moodEmoji}>
                {m.emoji}
              </Text>

              <Text
                style={[
                  styles.moodLabel,
                  selectedMood === i &&
                    styles.moodLabelSel,
                ]}
              >
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Saving indicator */}
        {saving && (
          <View style={styles.savingContainer}>
            <ActivityIndicator
              size="small"
              color={colors.sage}
            />
            <Text style={styles.savingText}>
              Saving mood...
            </Text>
          </View>
        )}

        {/* Quote */}
        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>
            "Take a deep breath. You are exactly where
            you need to be."
          </Text>
        </View>

        {/* Action cards */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.actionCard,
              { backgroundColor: colors.rose },
            ]}
            onPress={() =>
              router.push('/(tabs)/wellness/history')
            }
            activeOpacity={0.85}
          >
            <Text style={styles.actionIcon}>📔</Text>

            <Text style={styles.actionTitle}>
              Journal History
            </Text>

            <Text style={styles.actionSub}>Read</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionCard,
              { backgroundColor: colors.sage },
            ]}
            onPress={() =>
              router.push('/(tabs)/wellness/meditation')
            }
            activeOpacity={0.85}
          >
            <Text style={styles.actionIcon}>🫁</Text>

            <Text style={styles.actionTitle}>
              Meditate Timer
            </Text>

            <Text style={styles.actionSub}>24h</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },

  scroll: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  greetingSub: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 2,
  },

  greetingTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.dark,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.blue,
  },

  moodRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },

  moodChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },

  moodChipSel: {
    backgroundColor: colors.sageL,
    borderColor: colors.sage,
  },

  moodEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },

  moodLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.muted,
  },

  moodLabelSel: {
    color: colors.sageD,
  },

  savingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },

  savingText: {
    fontSize: 12,
    color: colors.muted,
  },

  quoteBox: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    minHeight: 90,
  },

  quoteText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.muted,
    lineHeight: 21,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },

  actionCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
  },

  actionIcon: {
    fontSize: 20,
    marginBottom: 6,
  },

  actionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.white,
  },

  actionSub: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
});