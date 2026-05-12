import Svg, { Path, Rect } from 'react-native-svg';

import { waterColors as w } from '@/theme/nutrition';

type Props = {
  size?: number;
  stroke?: string;
  wave?: string;
};

export function CupIcon({ size = 22, stroke = w.primary, wave = w.wave }: Props) {
  return (
    <Svg viewBox="0 0 40 40" width={size} height={size} fill="none">
      <Rect
        x={8}
        y={10}
        width={24}
        height={22}
        rx={3}
        stroke={stroke}
        strokeWidth={2.5}
        fill="none"
      />
      <Path
        d="M12 10V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"
        stroke={stroke}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <Path
        d="M14 20 Q17 24 20 20 Q23 16 26 20"
        stroke={wave}
        strokeWidth={1.8}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M14 26 Q17 30 20 26 Q23 22 26 26"
        stroke={wave}
        strokeWidth={1.8}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
