import { supabase } from './supabase';

export interface JournalEntry {
  id: string;
  user_id: string;
  mood_index: number;
  mood_emoji: string;
  content: string;
  tags: string[];
  logged_at: string;
  created_at: string;
}

export const JOURNAL_MOODS = [
  '😄',
  '😊',
  '😐',
  '😢',
  '😤',
];

// ─────────────────────────────────────
// Save Journal
// ─────────────────────────────────────
export async function saveJournalEntry(
  moodIndex: number,
  content: string,
  tags: string[]
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('Chưa đăng nhập');
  }

  const { data, error } = await supabase
    .from('journal_entries')
    .insert({
      user_id: user.id,
      mood_index: moodIndex,
      mood_emoji:
        JOURNAL_MOODS[moodIndex],
      content: content.trim(),
      tags: tags,
    })
    .select()
    .single();

  if (error) throw error;

  return data as JournalEntry;
}

// ─────────────────────────────────────
// Get Journal History
// ─────────────────────────────────────
export async function getJournalHistory(
  limit = 30
): Promise<JournalEntry[]> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('Chưa đăng nhập');
  }

  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('logged_at', {
      ascending: false,
    })
    .limit(limit);

  if (error) throw error;

  return (data ?? []) as JournalEntry[];
}

// ─────────────────────────────────────
// Delete Journal
// ─────────────────────────────────────
export async function deleteJournalEntry(
  id: string
): Promise<void> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('Chưa đăng nhập');
  }

  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw error;
  }
}