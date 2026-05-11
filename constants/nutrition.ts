import { Coffee, Cookie, Droplet, Egg, Flame, Salad, Sandwich, Sun } from 'lucide-react-native';
import type { ComponentType } from 'react';
import type { ImageSourcePropType } from 'react-native';

import { nutritionColors as c } from '@/theme/nutrition';

export type LucideIconType = ComponentType<{ color?: string; size?: number; strokeWidth?: number }>;

export const NUTRITION_TARGETS = {
  calories: 2400,
  caloriesConsumed: 1728,
  caloriesRemaining: 672,
  caloriesBurned: 340,
  waterGoalL: 2.5,
  waterIntakeL: 1.8,
} as const;

export type DashboardMealItem = {
  id: string;
  title: string;
  desc: string;
  kcal?: string;
  time: string;
  image?: ImageSourcePropType;
  empty?: boolean;
};

export const DASHBOARD_MEALS: DashboardMealItem[] = [
  {
    id: 'b',
    title: 'Breakfast',
    desc: 'Greek Yogurt, Berries, Almonds, Honey',
    kcal: '420 KCAL',
    time: '08:30 AM',
    image: require('@/assets/images/nutrition/breakfast.png'),
  },
  {
    id: 'l',
    title: 'Lunch',
    desc: 'Salmon Quinoa Salad with Avocado',
    kcal: '680 KCAL',
    time: '01:15 PM',
    image: require('@/assets/images/nutrition/lunch.png'),
  },
  {
    id: 'd',
    title: 'Dinner',
    desc: 'Not logged yet',
    time: 'Plan: 07:30 PM',
    empty: true,
  },
  {
    id: 's',
    title: 'Snacks',
    desc: 'Mixed Nuts & Dark Chocolate',
    kcal: '150 KCAL',
    time: '04:45 PM',
    image: require('@/assets/images/nutrition/snacks.png'),
  },
];

export const DASHBOARD_MACROS = [
  { label: 'Carbohydrates', current: '180g', total: '250g', pct: 0.72, color: c.sage },
  { label: 'Protein', current: '95g', total: '120g', pct: 0.79, color: c.blueLight },
  { label: 'Fats', current: '45g', total: '70g', pct: 0.64, color: c.yellow },
] as const;

export type FoodLogItemData = {
  id: string;
  title: string;
  meta: string;
  image: ImageSourcePropType;
};

export type FoodLogSectionData = {
  id: string;
  title: string;
  consumed: string;
  Icon: LucideIconType;
  items: FoodLogItemData[];
};

export const FOOD_LOG_SECTIONS: FoodLogSectionData[] = [
  {
    id: 'b',
    title: 'Breakfast',
    consumed: '320 kcal consumed',
    Icon: Sun,
    items: [
      {
        id: 'b1',
        title: 'Avocado Toast',
        meta: '1 slice • 210 kcal',
        image: require('@/assets/images/nutrition/avocado-toast-sm.png'),
      },
      {
        id: 'b2',
        title: 'Iced Oat Latte',
        meta: 'Medium • 110 kcal',
        image: require('@/assets/images/nutrition/iced-oat-latte.png'),
      },
    ],
  },
  {
    id: 'l',
    title: 'Lunch',
    consumed: '540 kcal consumed',
    Icon: Salad,
    items: [
      {
        id: 'l1',
        title: 'Quinoa Power Bowl',
        meta: 'Regular size • 420 kcal',
        image: require('@/assets/images/nutrition/quinoa-bowl.png'),
      },
      {
        id: 'l2',
        title: 'Green Glow Juice',
        meta: '350ml • 120 kcal',
        image: require('@/assets/images/nutrition/green-juice.png'),
      },
    ],
  },
];

export const FOOD_LOG_SNACK_SECTION: FoodLogSectionData = {
  id: 's',
  title: 'Snacks',
  consumed: '160 kcal consumed',
  Icon: Cookie,
  items: [
    {
      id: 's1',
      title: 'Handful of Walnuts',
      meta: '25g • 160 kcal',
      image: require('@/assets/images/nutrition/mixed-nuts.png'),
    },
  ],
};

export const FOOD_LOG_TOTAL = {
  consumed: 1420,
  goal: 2100,
  remaining: 680,
  pct: 0.67,
};

export const FOOD_LOG_MACRO_PIES = [
  { label: 'Carbs', value: '145g', pct: 0.55 },
  { label: 'Protein', value: '62g', pct: 0.6998 },
  { label: 'Fats', value: '38g', pct: 0.3998 },
] as const;

export const ADD_FOOD_FILTERS = ['All', 'Recent', 'Favorites', 'Meals'] as const;

export type RecentFoodData = {
  title: string;
  meta: string;
  iconBg: string;
  Icon: LucideIconType;
  iconColor: string;
};

export const RECENT_FOODS: RecentFoodData[] = [
  { title: 'Organic Soft-Boiled Egg', meta: '1 large • 78 kcal', iconBg: c.sageBg20, Icon: Egg, iconColor: c.sageDark },
  { title: 'Avocado Sourdough Toast', meta: '1 slice • 245 kcal', iconBg: c.pinkBg20, Icon: Sandwich, iconColor: c.pink },
  { title: 'Oat Milk Latte', meta: 'Medium • 120 kcal', iconBg: c.blueBg20, Icon: Coffee, iconColor: c.blue },
];

export type NutrientFocusData = {
  label: string;
  value: string;
  unit: string;
  pct: number;
  barColor: string;
  bgColor: string;
  borderColor: string;
  Icon: LucideIconType;
  iconColor: string;
};

export const NUTRIENT_FOCUS: NutrientFocusData[] = [
  {
    label: 'PROTEIN',
    value: '42',
    unit: '/ 65g',
    pct: 0.64,
    barColor: c.sageDark,
    bgColor: c.sageBg10,
    borderColor: 'rgba(168,197,160,0.2)',
    Icon: Egg,
    iconColor: c.sageDark,
  },
  {
    label: 'HYDRATION',
    value: '1.2',
    unit: '/ 2.5L',
    pct: 0.48,
    barColor: c.blue,
    bgColor: 'rgba(171,190,222,0.1)',
    borderColor: 'rgba(171,190,222,0.2)',
    Icon: Droplet,
    iconColor: c.blue,
  },
];

export const ADD_FOOD_CALORIE_BALANCE = {
  Icon: Flame,
  title: 'Daily Calorie Balance',
  sub: '850 kcal remaining for today',
};

export type FactRow = { label: string; value: string; sub?: boolean };
export type FactGroup = { rows: FactRow[] };

export type FoodDetailData = {
  title: string;
  subtitle: string;
  heroImage: ImageSourcePropType;
  totalKcal: number;
  macros: { label: string; value: string; pct: number; labelColor: string; barColor: string }[];
  servingLabel: string;
  servingValue: string;
  factGroups: FactGroup[];
  vitamins: { label: string; value: string }[];
};

export type ScanHistoryData = {
  id: string;
  title: string;
  brand: string;
  meta: string;
  ago: string;
  tag: string;
  tagBg: string;
  tagColor: string;
  image: ImageSourcePropType;
  imageBg: string;
  imagePadding?: number;
};

export const SCAN_HISTORY: ScanHistoryData[] = [
  {
    id: 'greek-yogurt',
    title: 'Greek Yogurt',
    brand: 'Fage Total 2%',
    meta: '210 kcal • 12g Protein • 4g Fat',
    ago: '2m ago',
    tag: 'HIGH IN PROTEIN',
    tagBg: '#E8F5E9',
    tagColor: '#2E7D32',
    image: require('@/assets/images/nutrition/greek-yogurt.png'),
    imageBg: '#F2F0E8',
    imagePadding: 8,
  },
  {
    id: 'almond-milk',
    title: 'Almond Milk',
    brand: 'Unsweetened',
    meta: '30 kcal • 1g Protein • 2.5g Fat',
    ago: '1h ago',
    tag: 'LOW SUGAR',
    tagBg: '#FFF3E0',
    tagColor: '#EF6C00',
    image: require('@/assets/images/nutrition/organic-oat-package.png'),
    imageBg: '#171717',
  },
  {
    id: 'oat-granola',
    title: 'Oat Granola',
    brand: 'Honey Roasted',
    meta: '210 kcal • 5g Protein • 18g Carbs',
    ago: 'Yesterday',
    tag: 'HIGH FIBER',
    tagBg: '#E8F5E9',
    tagColor: '#2E7D32',
    image: require('@/assets/images/nutrition/honey-oat-granola.png'),
    imageBg: '#535D4B',
    imagePadding: 12,
  },
];

export type ScanResultData = {
  title: string;
  brand: string;
  image: ImageSourcePropType;
  imageBg: string;
  cameraBg: ImageSourcePropType;
  tags: { label: string; bg: string; color: string }[];
  nutrition: { value: string; unit: string }[];
};

export const SCAN_RESULT: ScanResultData = {
  title: 'Organic Greek\nYogurt',
  brand: 'Fage Total 2%',
  image: require('@/assets/images/nutrition/greek-yogurt-card.png'),
  imageBg: '#F9EBE4',
  cameraBg: require('@/assets/images/nutrition/organic-food-bg.png'),
  tags: [
    { label: 'HIGH\nPROTEIN', bg: '#A8C5A0', color: '#395235' },
    { label: 'LOW\nSUGAR', bg: '#EEE0D8', color: '#434840' },
  ],
  nutrition: [
    { value: '120', unit: 'KCAL' },
    { value: '12g', unit: 'PROT' },
    { value: '4g', unit: 'FAT' },
    { value: '8g', unit: 'CARBS' },
  ],
};

export type FoodLogConfirmData = {
  foodName: string;
  /** Three short caps labels, e.g. "120 KCAL" */
  macros: [string, string, string];
};

export const FOOD_LOG_CONFIRM_SCAN: FoodLogConfirmData = {
  foodName: 'Organic Greek Yogurt',
  macros: ['120 KCAL', '12G PROTEIN', '4G FAT'],
};

export const AVOCADO_TOAST: FoodDetailData = {
  title: 'Avocado & Sourdough',
  subtitle: 'Artisan Breakfast Selection',
  heroImage: require('@/assets/images/nutrition/artisan-avocado-toast.png'),
  totalKcal: 340,
  macros: [
    { label: 'Carbohydrates', value: '42g', pct: 0.6, labelColor: c.blue, barColor: c.blueLight },
    { label: 'Protein', value: '12g', pct: 0.25, labelColor: c.sageDark, barColor: c.sage },
    { label: 'Fats', value: '18g', pct: 0.45, labelColor: c.pink, barColor: c.pinkLight },
  ],
  servingLabel: 'SERVING SIZE',
  servingValue: '1 Slice (85g)',
  factGroups: [
    {
      rows: [
        { label: 'Total Fat', value: '18g' },
        { label: 'Saturated Fat', value: '3.5g', sub: true },
      ],
    },
    {
      rows: [
        { label: 'Cholesterol', value: '0mg' },
        { label: 'Sodium', value: '310mg' },
      ],
    },
    {
      rows: [
        { label: 'Total Carbohydrate', value: '42g' },
        { label: 'Dietary Fiber', value: '11g', sub: true },
        { label: 'Total Sugars', value: '2g', sub: true },
      ],
    },
    { rows: [{ label: 'Protein', value: '12g' }] },
  ],
  vitamins: [
    { label: 'Vitamin D', value: '0%' },
    { label: 'Calcium', value: '8%' },
    { label: 'Iron', value: '15%' },
    { label: 'Potassium', value: '12%' },
  ],
};

export function getFoodLogConfirmFromDetail(): FoodLogConfirmData {
  const protein = AVOCADO_TOAST.macros.find((m) => m.label === 'Protein')?.value ?? '0g';
  const fats = AVOCADO_TOAST.macros.find((m) => m.label === 'Fats')?.value ?? '0g';
  const pk = parseInt(protein.replace(/\D/g, ''), 10) || 0;
  const fk = parseInt(fats.replace(/\D/g, ''), 10) || 0;
  return {
    foodName: AVOCADO_TOAST.title,
    macros: [`${AVOCADO_TOAST.totalKcal} KCAL`, `${pk}G PROTEIN`, `${fk}G FAT`],
  };
}
