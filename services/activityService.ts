import { supabase } from '@/utils/supabase'
import { API_BASE_URL } from '@/constants/api'

const BASE_URL = API_BASE_URL

let cachedToken = ''
let tokenExpiry = 0

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken
  }

  try {
    const { data } = await supabase.auth.getSession()
    if (data.session?.access_token) {
      cachedToken = data.session.access_token
      tokenExpiry = Date.now() + 50 * 60 * 1000
      return cachedToken
    }
  } catch (e) {
    console.log('Lỗi lấy session:', e)
  }

  return ''
}

export async function logActivity(activityData: {
  activity_type: string
  duration: number
  intensity: string
  notes?: string
}) {
  const token = await getToken()
  const response = await fetch(`${BASE_URL}/api/activities/log`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify(activityData)
  })
  if (!response.ok) throw new Error('Lưu thất bại')
  return await response.json()
}

export async function getActivityHistory() {
  const token = await getToken()
  const response = await fetch(`${BASE_URL}/api/activities/history`, {
    headers: { 'authorization': `Bearer ${token}` }
  })
  if (!response.ok) throw new Error('Lấy lịch sử thất bại')
  return await response.json()
}

export async function getTodaySummary() {
  const token = await getToken()
  const response = await fetch(`${BASE_URL}/api/summary/today`, {
    headers: { 'authorization': `Bearer ${token}` }
  })
  if (!response.ok) throw new Error('Lấy summary thất bại')
  return await response.json()
}

export async function getExercises(activityType: string, intensity: string) {
  const response = await fetch(
    `${BASE_URL}/api/activities/exercises?activity_type=${activityType}&intensity=${intensity}`
  )
  if (!response.ok) throw new Error('Lấy bài tập thất bại')
  return await response.json()
}