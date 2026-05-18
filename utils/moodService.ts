/**
 */
import { supabase } from './supabase';

// ─────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────
export interface MoodLog {
  id: string;
  user_id: string;
  mood_index: number;
  mood_label: string;
  mood_emoji: string;
  note?: string;
  logged_at: string;
  created_at: string;
}

export interface MoodStats {
  label: string;
  emoji: string;
  count: number;
  percentage: number;
}

// ─────────────────────────────────────────────────────
// Mood List
// ─────────────────────────────────────────────────────
export const MOODS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😤', label: 'Angry' },
  { emoji: '😴', label: 'Tired' },
];

// ─────────────────────────────────────────────────────
// Log Mood
// ─────────────────────────────────────────────────────
export async function logMood(
  moodIndex: number,
  note?: string
): Promise<MoodLog> {
  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('Chưa đăng nhập');
  }

  // Validate mood
  const mood = MOODS[moodIndex];

  if (!mood) {
    throw new Error('Mood không hợp lệ');
  }

  // Insert mood log
  const { data, error } = await supabase
    .from('mood_logs')
    .insert({
      user_id: user.id,
      mood_index: moodIndex,
      mood_label: mood.label,
      mood_emoji: mood.emoji,
      note: note ?? null,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as MoodLog;
}

// ─────────────────────────────────────────────────────
// Get Mood History
// ─────────────────────────────────────────────────────
export async function getMoodHistory(
  limit = 30
): Promise<MoodLog[]> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('Chưa đăng nhập');
  }

  const { data, error } = await supabase
    .from('mood_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('logged_at', {
      ascending: false,
    })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data ?? []) as MoodLog[];
}

// ─────────────────────────────────────────────────────
// Get Today Mood
// ─────────────────────────────────────────────────────
export async function getTodayMood(): Promise<MoodLog | null> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('Chưa đăng nhập');
  }

  // Start of today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('mood_logs')
    .select('*')
    .eq('user_id', user.id)
    .gte('logged_at', today.toISOString())
    .order('logged_at', {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as MoodLog | null;
}

// ─────────────────────────────────────────────────────
// Get Mood Statistics (ALL DATA)
// ─────────────────────────────────────────────────────
export async function getMoodStats(): Promise<MoodStats[]> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('Chưa đăng nhập');
  }

  // Get ALL mood logs
  const { data, error } = await supabase
    .from('mood_logs')
    .select(`
      mood_index,
      mood_label,
      mood_emoji,
      logged_at
    `)
    .eq('user_id', user.id);

  if (error) {
    throw error;
  }

  // No data
  if (!data || data.length === 0) {
    return MOODS.map((mood) => ({
      label: mood.label,
      emoji: mood.emoji,
      count: 0,
      percentage: 0,
    }));
  }

  const total = data.length;

  // Count by emoji
  return MOODS.map((mood) => {
    const count = data.filter(
      (row) =>
        row.mood_emoji === mood.emoji
    ).length;

    return {
      label: mood.label,
      emoji: mood.emoji,
      count,
      percentage:
        total > 0
          ? Math.round(
              (count / total) * 100
            )
          : 0,
    };
  });
}