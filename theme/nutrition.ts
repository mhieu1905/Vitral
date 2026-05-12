export const nutritionColors = {
  bg: '#FFF8F5',
  bgAlt: '#FDF8F3',
  card: '#FFFFFF',
  cardCream: '#FFF1E9',
  cardPeach: '#F3E5DE',

  sageDark: '#4B6546',
  sage: '#A8C5A0',
  sageBg20: 'rgba(168,197,160,0.2)',
  sageBg10: 'rgba(168,197,160,0.1)',
  sageBg30: 'rgba(168,197,160,0.3)',

  blue: '#4D5F7B',
  blueLight: '#ABBEDE',
  blueBg20: 'rgba(171,190,222,0.2)',
  blueBg30: 'rgba(171,190,222,0.3)',

  pink: '#7B5455',
  pinkLight: '#FDCBCB',
  pinkBg20: 'rgba(253,203,203,0.2)',

  yellow: '#F2D9A0',

  textDark: '#211A16',
  textDark2: '#3D3530',
  textDim: '#434840',
  textMuted: '#737970',
  textMuted2: '#8C7B72',
  textHint: '#C4B5AC',

  border: '#EEE0D8',
  borderSoft: 'rgba(238,224,216,0.5)',
};

/**
 * Water Log — same family as VitalTrack nutrition: warm cream surfaces,
 * slate blue accents (`blue` / `blueLight`), sage for success, pink for warmth.
 */
export const waterColors = {
  primary: '#4D5F7B',
  primaryDeep: '#3A4A5F',
  primaryLight: '#ABBEDE',
  wave: '#B8C7DC',
  highlight: '#CDD8E8',

  bg: '#FFF8F5',
  surface: '#FDF8F3',
  /** blueBg20-ish */
  tint: 'rgba(171,190,222,0.2)',
  tintStrong: 'rgba(171,190,222,0.32)',
  tintSoft: 'rgba(171,190,222,0.38)',
  track: 'rgba(171,190,222,0.45)',
  trackSoft: '#C5CED9',
  border: '#EEE0D8',

  successFrom: '#4B6546',
  successTo: '#354435',

  accentWarm: '#7B5455',
  warmBg: 'rgba(253,203,203,0.22)',

  textStrong: '#211A16',
  textBody: '#3D3530',
  textMuted: '#737970',
  textHint: '#8C7B72',
} as const;

export const nutritionFonts = {
  displayBold: 'PlusJakartaSans_700Bold',
  displaySemi: 'PlusJakartaSans_600SemiBold',
  displayMed: 'PlusJakartaSans_500Medium',
  display: 'PlusJakartaSans_400Regular',
  bodyBold: 'DMSans_700Bold',
  bodyMed: 'DMSans_500Medium',
  body: 'DMSans_400Regular',
} as const;
