import BottomNav from '@/components/bottom-nav';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../theme/colors';
const router = useRouter();

const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😤', label: 'Angry' },
  { emoji: '😴', label: 'Tired' },
];

export default function WellnessScreen() {
  const [selectedMood, setSelectedMood] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header row */}
        <View style={styles.topRow}>
          <View>
            <Text style={styles.greetingSub}>Good morning</Text>
            <Text style={styles.greetingTitle}>How are you today?</Text>
          </View>
          <View style={styles.avatar} />
        </View>

        {/* Mood chips */}
        <View style={styles.moodRow}>
          {moods.map((m, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.moodChip, selectedMood === i && styles.moodChipSel]}
              onPress={() => setSelectedMood(i)}
              activeOpacity={0.8}
            >
              <Text style={styles.moodEmoji}>{m.emoji}</Text>
              <Text style={[styles.moodLabel, selectedMood === i && styles.moodLabelSel]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quote */}
        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>
            "Take a deep breath. You are exactly where you need to be."
          </Text>
        </View>

        {/* Action cards */}
        <View style={styles.actionRow}>
  <TouchableOpacity
    style={[styles.actionCard, { backgroundColor: colors.rose }]}
    onPress={() => router.push('/(tabs)/wellness/journal')}
    activeOpacity={0.85}
  >
    <Text style={styles.actionIcon}>📔</Text>
    <Text style={styles.actionTitle}>Journal History</Text>
    <Text style={styles.actionSub}>Read</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.actionCard, { backgroundColor: colors.sage }]}
    onPress={() => router.push('/(tabs)/wellness/meditation')}
    activeOpacity={0.85}
  >
    <Text style={styles.actionIcon}>🫁</Text>
    <Text style={styles.actionTitle}>Meditate Timer</Text>
    <Text style={styles.actionSub}>24h</Text>
  </TouchableOpacity>
</View>

      </ScrollView>
      {/* <BottomNav navigation={navigation} activeScreen="Wellness" /> */}
      <BottomNav/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: colors.cream },
  scroll:        { flex: 1, paddingHorizontal: 24, paddingTop: 12 },
  topRow:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  greetingSub:   { fontSize: 13, color: colors.muted, marginBottom: 2 },
  greetingTitle: { fontSize: 22, fontWeight: '600', color: colors.dark },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.blue,
  },
  moodRow:      { flexDirection: 'row', gap: 8, marginBottom: 16 },
  moodChip: {
    flex: 1, alignItems: 'center', paddingVertical: 10,
    backgroundColor: colors.surface, borderRadius: 10,
    borderWidth: 1.5, borderColor: 'transparent',
  },
  moodChipSel:  { backgroundColor: colors.sageL, borderColor: colors.sage },
  moodEmoji:    { fontSize: 22, marginBottom: 4 },
  moodLabel:    { fontSize: 10, fontWeight: '500', color: colors.muted },
  moodLabelSel: { color: colors.sageD },
  quoteBox: {
    backgroundColor: colors.surface, borderRadius: 16,
    padding: 16, marginBottom: 16, minHeight: 90,
  },
  quoteText:  { fontSize: 13, fontStyle: 'italic', color: colors.muted, lineHeight: 21 },
  actionRow:  { flexDirection: 'row', gap: 10, marginBottom: 24 },
  actionCard: { flex: 1, borderRadius: 16, padding: 14 },
  actionIcon: { fontSize: 20, marginBottom: 6 },
  actionTitle:{ fontSize: 13, fontWeight: '600', color: colors.white },
  actionSub:  { fontSize: 10, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
});