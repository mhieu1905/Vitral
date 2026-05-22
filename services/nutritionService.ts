import { API_BASE_URL } from '@/constants/api'
import { supabase } from '@/utils/supabase'
import { ImageSourcePropType } from 'react-native'

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
    console.log('Lỗi lấy session nutrition:', e)
  }

  return ''
}

// ── Local HD Asset Mappers ──────────────────────────────────────────────────
export function getMealImage(mealId: string): ImageSourcePropType | undefined {
  const code = mealId.toLowerCase().charAt(0)
  switch (code) {
    case 'b':
      return require("@/assets/images/nutrition/breakfast.png")
    case 'l':
      return require("@/assets/images/nutrition/lunch.png")
    case 's':
      return require("@/assets/images/nutrition/snacks.png")
    default:
      return undefined
  }
}

export function getFoodImage(title: string): ImageSourcePropType {
  const t = title.toLowerCase()
  if (t.includes("avocado") || t.includes("toast") || t.includes("sourdough")) {
    return require("@/assets/images/nutrition/avocado-toast-sm.png")
  }
  if (t.includes("latte") || t.includes("coffee") || t.includes("iced oat") || t.includes("cà phê") || t.includes("cafe")) {
    return require("@/assets/images/nutrition/iced-oat-latte.png")
  }
  if (t.includes("salmon") || t.includes("fish") || t.includes("cá") || t.includes("seafood") || t.includes("tôm") || t.includes("shrimp")) {
    return require("@/assets/images/nutrition/recipes/lemon-garlic-salmon.png")
  }
  if (t.includes("chicken") || t.includes("beef") || t.includes("steak") || t.includes("pork") || t.includes("meat") || t.includes("heo") || t.includes("bò") || t.includes("gà") || t.includes("cơm") || t.includes("rice") || t.includes("phở") || t.includes("pho") || t.includes("bún") || t.includes("bun") || t.includes("lẩu") || t.includes("hotpot")) {
    return require("@/assets/images/nutrition/recipes/grilled-chicken-power-bowl.png")
  }
  if (t.includes("tofu") || t.includes("chay")) {
    return require("@/assets/images/nutrition/recipes/teriyaki-tofu-bowl.png")
  }
  if (t.includes("lentil") || t.includes("salad") || t.includes("rau") || t.includes("veggie") || t.includes("bánh mì") || t.includes("banh mi")) {
    return require("@/assets/images/nutrition/recipes/mediterranean-lentil-bowl.png")
  }
  if (t.includes("bowl") || t.includes("quinoa")) {
    return require("@/assets/images/nutrition/quinoa-bowl.png")
  }
  if (t.includes("juice") || t.includes("green glow") || t.includes("glow juice")) {
    return require("@/assets/images/nutrition/green-juice.png")
  }
  if (t.includes("nuts") || t.includes("walnuts") || t.includes("chocolate")) {
    return require("@/assets/images/nutrition/mixed-nuts.png")
  }
  if (t.includes("yogurt") || t.includes("sữa chua")) {
    return require("@/assets/images/nutrition/greek-yogurt.png")
  }
  if (t.includes("oat package") || t.includes("organic oat") || t.includes("oatmeal")) {
    return require("@/assets/images/nutrition/organic-oat-package.png")
  }
  if (t.includes("granola")) {
    return require("@/assets/images/nutrition/honey-oat-granola.png")
  }
  if (t.includes("egg") || t.includes("trứng")) {
    return require("@/assets/images/nutrition/breakfast.png")
  }
  return require("@/assets/images/nutrition/greek-yogurt.png")
}

export function getFoodHeroImage(title: string): ImageSourcePropType {
  return getFoodImage(title);
}

// ── API Operations ──────────────────────────────────────────────────────────

export interface LogFoodPayload {
  food_name: string
  meal_type: string
  calories: number
  protein_g?: number
  carbs_g?: number
  fat_g?: number
  serving_size?: string
  serving_qty?: number
}

export async function logFood(payload: LogFoodPayload) {
  const token = await getToken()
  const response = await fetch(`${BASE_URL}/api/nutrition/log`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Log food failed: ${errorText}`)
  }
  return await response.json()
}

export async function logWater(amountMl: number) {
  const token = await getToken()
  const response = await fetch(`${BASE_URL}/api/nutrition/water`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ amount_ml: amountMl })
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Log water failed: ${errorText}`)
  }
  return await response.json()
}

export async function getNutritionDashboard() {
  const token = await getToken()
  const response = await fetch(`${BASE_URL}/api/nutrition/dashboard`, {
    headers: { 'authorization': `Bearer ${token}` }
  })
  if (!response.ok) {
    const errorText = await response.text()
    console.log('[NUTRITION SERVICE] getNutritionDashboard failed:', errorText)
    throw new Error(`Fetch nutrition dashboard failed: ${errorText}`)
  }
  return await response.json()
}

export type HydrationHistoryDay = {
  day: string
  value: number
  isToday: boolean
}

export async function getHydrationHistory(days: number = 7): Promise<HydrationHistoryDay[]> {
  const token = await getToken()
  const response = await fetch(`${BASE_URL}/api/nutrition/water/history?days=${days}`, {
    headers: { 'authorization': `Bearer ${token}` },
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Fetch hydration history failed: ${errorText}`)
  }
  return await response.json()
}

export async function getFoodLogToday() {
  const token = await getToken()
  const response = await fetch(`${BASE_URL}/api/nutrition/food-log/today`, {
    headers: { 'authorization': `Bearer ${token}` }
  })
  if (!response.ok) {
    throw new Error('Fetch food log today failed')
  }
  return await response.json()
}

export async function getFoodDetails(foodName: string) {
  const token = await getToken()
  const encodedName = encodeURIComponent(foodName)
  const response = await fetch(`${BASE_URL}/api/nutrition/foods/${encodedName}`, {
    headers: { 'authorization': `Bearer ${token}` }
  })
  if (!response.ok) {
    throw new Error(`Fetch food details failed for: ${foodName}`)
  }
  return await response.json()
}

export async function getFoodPresets() {
  const token = await getToken()
  const response = await fetch(`${BASE_URL}/api/nutrition/foods/presets`, {
    headers: { 'authorization': `Bearer ${token}` }
  })
  if (!response.ok) {
    throw new Error('Fetch food presets failed')
  }
  return await response.json()
}
