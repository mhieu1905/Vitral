import { API_BASE_URL } from '@/constants/api'
import { supabase } from '@/utils/supabase'

const BASE_URL = API_BASE_URL

let cachedToken = ''
let tokenExpiry = 0

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken
  }

  const { data } = await supabase.auth.getSession()
  if (data.session?.access_token) {
    cachedToken = data.session.access_token
    tokenExpiry = Date.now() + 50 * 60 * 1000
    return cachedToken
  }

  return ''
}

export type SleepArchitecture = {
  awake_min: number
  rem_min: number
  light_min: number
  deep_min: number
}

export type SleepTodayResponse = {
  log_date: string
  score: number
  status_text: string
  total_duration_min: number
  wake_time: string
  architecture: SleepArchitecture
  insight_title: string
  insight_description: string
}

export type UpsertSleepTodayPayload = {
  log_date: string // YYYY-MM-DD (local)
  start_time: string // HH:MM
  end_time: string // HH:MM
  awake_minutes?: number
  quality_user?: number // 1..5
  notes?: string
}

export function getLocalDateYYYYMMDD(date = new Date()): string {
  // en-CA yields YYYY-MM-DD in most JS engines
  const s = date.toLocaleDateString('en-CA')
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s

  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export async function getSleepToday(logDate?: string): Promise<SleepTodayResponse> {
  const token = await getToken()
  const date = logDate ?? getLocalDateYYYYMMDD()

  const response = await fetch(`${BASE_URL}/api/sleep/today?log_date=${date}`, {
    headers: { authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Fetch sleep today failed: ${errorText}`)
  }

  return await response.json()
}

export async function upsertSleepToday(payload: UpsertSleepTodayPayload) {
  const token = await getToken()
  const response = await fetch(`${BASE_URL}/api/sleep/today`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Upsert sleep failed: ${errorText}`)
  }

  return await response.json()
}
