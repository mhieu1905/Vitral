import { supabase } from '@/lib/supabase'

const BASE_URL = 'http://localhost:8000'

// Cache token để không gọi lại nhiều lần
let cachedToken = ''
let tokenExpiry = 0

async function getToken(): Promise<string> {
  // Nếu token còn hạn thì dùng luôn
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken
  }

  // Thử lấy từ Supabase session
  try {
    const { data } = await supabase.auth.getSession()
    if (data.session?.access_token) {
      cachedToken = data.session.access_token
      tokenExpiry = Date.now() + 50 * 60 * 1000 // cache 50 phút
      return cachedToken
    }
  } catch (e) {}

  // Nếu không có session → tự đăng nhập lấy token mới
  try {
    const response = await fetch(
      'https://rtwcrwasadfgjrdserms.supabase.co/auth/v1/token?grant_type=password',
      {
        method: 'POST',
        headers: {
          'apikey': 'sb_publishable_YPzvPVQVJYHb6fL_1QMCdQ_MNnFekLq',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'khapp1903@gmail.com',
          password: '123'
        })
      }
    )
    const json = await response.json()
    if (json.access_token) {
      cachedToken = json.access_token
      tokenExpiry = Date.now() + 50 * 60 * 1000 // cache 50 phút
      return cachedToken
    }
  } catch (e) {
    console.log('Lỗi lấy token:', e)
  }

  return ''
}

// CORE 1: Log activity
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

// CORE 2: Lấy lịch sử
export async function getActivityHistory() {
  const token = await getToken()
  const response = await fetch(`${BASE_URL}/api/activities/history`, {
    headers: { 'authorization': `Bearer ${token}` }
  })
  if (!response.ok) throw new Error('Lấy lịch sử thất bại')
  return await response.json()
}

// CORE 3: Summary hôm nay
export async function getTodaySummary() {
  const token = await getToken()
  const response = await fetch(`${BASE_URL}/api/summary/today`, {
    headers: { 'authorization': `Bearer ${token}` }
  })
  if (!response.ok) throw new Error('Lấy summary thất bại')
  return await response.json()
}

// Lấy danh sách bài tập
export async function getExercises(activityType: string, intensity: string) {
  const response = await fetch(
    `${BASE_URL}/api/activities/exercises?activity_type=${activityType}&intensity=${intensity}`
  )
  if (!response.ok) throw new Error('Lấy bài tập thất bại')
  return await response.json()
}