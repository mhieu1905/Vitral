import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type TextStyle, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { nutritionColors as c, nutritionFonts as f } from '@/theme/nutrition';
import type { LucideIconType } from '@/constants/nutrition';

export const TOP_BAR_OFFSET = 20;

type Props = {
  title: string;
  titleAlign?: 'left' | 'center';
  onBack?: () => void;
  leftIcon?: LucideIconType;
  onLeftIconPress?: () => void;
  rightSlot?: ReactNode;
  height?: number;
  backgroundColor?: string;
  titleStyle?: TextStyle;
  containerStyle?: ViewStyle;
  showBorderBottom?: boolean;
  showShadow?: boolean;
};

export function NutritionTopBar({
  title,
  titleAlign = 'left',
  onBack,
  leftIcon: LeftIcon,
  onLeftIconPress,
  rightSlot,
  height = 72,
  backgroundColor = c.bgAlt,
  titleStyle,
  containerStyle,
  showBorderBottom = false,
  showShadow = false,
}: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = onBack ?? (() => router.back());
  const showBack = !LeftIcon;

  const leftIconNode = LeftIcon ? <LeftIcon size={20} color={c.sageDark} strokeWidth={2} /> : null;

  return (
    <View
      style={[
        s.root,
        {
          paddingTop: insets.top + TOP_BAR_OFFSET,
          backgroundColor,
        },
      ]}
    >
      <View
        style={[
          s.bar,
          { height },
          showBorderBottom && s.borderBottom,
          showShadow && s.shadow,
          containerStyle,
        ]}
      >
        <View style={s.left}>
          {showBack ? (
            <Pressable hitSlop={10} onPress={handleBack}>
              <ChevronLeft size={20} color={c.sageDark} strokeWidth={2.5} />
            </Pressable>
          ) : onLeftIconPress ? (
            <Pressable hitSlop={10} onPress={onLeftIconPress}>
              {leftIconNode}
            </Pressable>
          ) : (
            leftIconNode
          )}
          {titleAlign === 'left' ? <Text style={[s.title, titleStyle]}>{title}</Text> : null}
        </View>

        {titleAlign === 'center' ? (
          <View style={s.titleCenter} pointerEvents="none">
            <Text style={[s.title, titleStyle]}>{title}</Text>
          </View>
        ) : null}

        {rightSlot ? <View style={s.right}>{rightSlot}</View> : null}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  /** Fills from y=0 so scroll bounce cannot show list content under the status bar / notch. */
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    elevation: 12,
  },
  bar: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(168,197,160,0.1)',
  },
  shadow: {
    shadowColor: '#3D3530',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 32,
    elevation: 4,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  titleCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: f.displaySemi,
    fontSize: 22,
    color: c.sageDark,
    lineHeight: 33,
    letterSpacing: -0.55,
  },
});
