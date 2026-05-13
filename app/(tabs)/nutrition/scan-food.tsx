import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Flashlight, ImageIcon, Leaf, Pencil } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { analyzeFoodImage } from '@/utils/gemini';
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { NutritionAvatar, NutritionTopBar } from "@/components/nutrition";
import { SCAN_HISTORY } from "@/constants/nutrition";
import { nutritionColors as c, nutritionFonts as f } from "@/theme/nutrition";

const W = Dimensions.get("window").width;
const SCANNER_W = W - 48;
const SCANNER_H = SCANNER_W / 0.9;
const FRAME_W = SCANNER_W * 0.78;
const FRAME_H = SCANNER_H * 0.65;

export default function ScanFoodScreen() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);

  const scanLine = useSharedValue(0);
  const cornerPulse = useSharedValue(0);
  const pillBreath = useSharedValue(0);
  const cardPress = useSharedValue(1);

  useEffect(() => {
    scanLine.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.cubic) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.cubic) }),
      ),
      -1,
      false,
    );
    cornerPulse.value = withRepeat(
      withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
    pillBreath.value = withRepeat(
      withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [scanLine, cornerPulse, pillBreath]);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scanLine.value, [0, 1], [0, FRAME_H - 32]) },
    ],
    opacity: interpolate(scanLine.value, [0, 0.1, 0.9, 1], [0.2, 1, 1, 0.2]),
  }));

  const cornerGlowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(cornerPulse.value, [0, 1], [0.5, 1]),
    transform: [{ scale: interpolate(cornerPulse.value, [0, 1], [1, 1.06]) }],
  }));

  const pillStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pillBreath.value, [0, 1], [0.75, 1]),
  }));

  const viewportPressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardPress.value }],
  }));

  const startScan = async () => {
    if (isScanning) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    cardPress.value = withSequence(
      withTiming(0.97, { duration: 120 }),
      withTiming(1, { duration: 180 }),
    );
    
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Camera access is needed to scan food.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.7,
        base64: true,
      });

      if (result.canceled || !result.assets[0].base64) {
        return;
      }

      setIsScanning(true);
      const imageBase64 = result.assets[0].base64;
      const imageUri = result.assets[0].uri;
      
      const analysisData = await analyzeFoodImage(imageBase64);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push({
        pathname: "/nutrition/scan-success",
        params: {
          scannedData: JSON.stringify(analysisData),
          imageUri: imageUri
        }
      });
      
    } catch (error) {
      console.error(error);
      Alert.alert("Scan Failed", "Could not analyze the food image.");
    } finally {
      setIsScanning(false);
    }
  };

  const importPhoto = async () => {
    if (isScanning) return;
    
    Haptics.selectionAsync();
    
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Photo library access is needed to import food images.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.7,
        base64: true,
      });

      if (result.canceled || !result.assets[0].base64) {
        return;
      }

      setIsScanning(true);
      const imageBase64 = result.assets[0].base64;
      const imageUri = result.assets[0].uri;
      
      const analysisData = await analyzeFoodImage(imageBase64);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push({
        pathname: "/nutrition/scan-success",
        params: {
          scannedData: JSON.stringify(analysisData),
          imageUri: imageUri
        }
      });
      
    } catch (error) {
      console.error(error);
      Alert.alert("Import Failed", "Could not analyze the food image.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleFlashlight = () => {
    Haptics.selectionAsync();
    Alert.alert("Flashlight", "You can turn on the flash directly inside the camera screen when taking a photo.");
  };

  return (
    <SafeAreaView style={s.safe} edges={["bottom"]}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.duration(420).delay(60)}
          style={s.hero}
        >
          <View style={s.pill}>
            <Leaf size={13} color={c.sageDark} strokeWidth={2} />
            <Text style={s.pillText}>Nourishment awareness today</Text>
          </View>
          <Text style={s.h1}>Scan mindfully</Text>
          <Text style={s.subtitle}>
            Capture nutrition. Fuel your best self.
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(480).delay(160).springify().damping(14)}
          style={[s.viewportShadow, viewportPressStyle]}
        >
          <Pressable onPress={startScan} style={s.viewport}>
            <Image
              source={require("@/assets/images/nutrition/organic-oat-package.png")}
              style={s.viewportImg}
              contentFit="cover"
            />
            <View style={s.viewportDim} />

            <View style={s.frameWrap} pointerEvents="none">
              <View style={s.frame}>
                <Animated.View
                  style={[s.corner, s.cornerTL, cornerGlowStyle]}
                />
                <Animated.View
                  style={[s.corner, s.cornerTR, cornerGlowStyle]}
                />
                <Animated.View
                  style={[s.corner, s.cornerBL, cornerGlowStyle]}
                />
                <Animated.View
                  style={[s.corner, s.cornerBR, cornerGlowStyle]}
                />

                <Animated.View
                  style={[s.scanLine, scanLineStyle]}
                  pointerEvents="none"
                >
                  <View style={s.scanLineFadeL} />
                  <View style={s.scanLineCore} />
                  <View style={s.scanLineFadeR} />
                </Animated.View>

                <Animated.View style={[s.guidance, pillStyle]}>
                  {isScanning ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={s.guidanceText}>
                      Tap here to capture food photo
                    </Text>
                  )}
                </Animated.View>
              </View>
            </View>
          </Pressable>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(420).delay(280)}
          style={s.actionsRow}
        >
          <ActionButton
            Icon={ImageIcon}
            label="Import Photo"
            onPress={importPhoto}
          />
          <ActionButton
            Icon={Pencil}
            label="Manual Entry"
            onPress={() => Haptics.selectionAsync()}
          />
          <ActionButton
            Icon={Flashlight}
            label="Flash Lighting"
            onPress={handleFlashlight}
          />
        </Animated.View>

        <View style={s.historyHeader}>
          <Text style={s.historyTitle}>Nourishment{`\n`}History</Text>
          <Pressable hitSlop={6} style={s.seeAll}>
            <Text style={s.seeAllText}>See{`\n`}all</Text>
          </Pressable>
        </View>

        <View style={s.historyList}>
          {SCAN_HISTORY.map((item, idx) => (
            <Animated.View
              key={item.id}
              entering={FadeInUp.duration(360).delay(380 + idx * 80)}
              style={s.historyCard}
            >
              <View
                style={[
                  s.historyImgBox,
                  {
                    backgroundColor: item.imageBg,
                    padding: item.imagePadding ?? 0,
                  },
                ]}
              >
                <Image
                  source={item.image}
                  style={s.historyImg}
                  contentFit="cover"
                />
              </View>
              <View style={s.historyTextWrap}>
                <View style={s.historyTopRow}>
                  <Text style={s.historyName}>{item.title}</Text>
                  <Text style={s.historyAgo}>{item.ago}</Text>
                </View>
                <Text style={s.historyMeta}>{item.meta}</Text>
                <View style={[s.historyTag, { backgroundColor: item.tagBg }]}>
                  <Text style={[s.historyTagText, { color: item.tagColor }]}>
                    {item.tag}
                  </Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      <NutritionTopBar
        title="Scan Food"
        titleAlign="center"
        height={64}
        backgroundColor="rgba(253,248,243,0.8)"
        titleStyle={{
          fontSize: 18,
          lineHeight: 28,
          letterSpacing: -0.3,
          color: c.textDark,
        }}
        onBack={() => router.replace("/nutrition/add-food")}
        rightSlot={<NutritionAvatar variant="sage" />}
      />
    </SafeAreaView>
  );
}

function ActionButton({
  Icon,
  label,
  onPress,
}: {
  Icon: React.ComponentType<{
    size?: number;
    color?: string;
    strokeWidth?: number;
  }>;
  label: string;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Pressable
      style={s.actionBtnWrap}
      onPressIn={() => {
        scale.value = withTiming(0.94, { duration: 90 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 140 });
      }}
      onPress={onPress}
    >
      <Animated.View style={[s.actionBtn, style]}>
        <Icon size={20} color={c.textDark} strokeWidth={2} />
        <Text style={s.actionLabel}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: c.bgAlt },
  scroll: { flex: 1 },
  content: { paddingTop: 120, paddingBottom: 64 },

  hero: { paddingHorizontal: 24, alignItems: "center", gap: 12 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: c.sageBg20,
  },
  pillText: {
    fontFamily: f.bodyMed,
    fontSize: 12,
    color: c.sageDark,
    lineHeight: 16,
  },
  h1: {
    marginTop: 4,
    fontFamily: f.displayBold,
    fontSize: 40,
    color: c.textDark,
    textAlign: "center",
    letterSpacing: -1,
    lineHeight: 50,
  },
  subtitle: {
    fontFamily: f.body,
    fontSize: 17,
    color: c.textDim,
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 26,
  },

  viewportShadow: {
    marginTop: 32,
    marginHorizontal: 24,
    borderRadius: 48,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 25 },
    shadowRadius: 50,
    elevation: 14,
  },
  viewport: {
    width: SCANNER_W,
    height: SCANNER_H,
    borderRadius: 48,
    overflow: "hidden",
    backgroundColor: "#171717",
  },
  viewportImg: { ...StyleSheet.absoluteFillObject, opacity: 0.9 },
  viewportDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  frameWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  frame: {
    width: FRAME_W,
    height: FRAME_H,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: c.sageDark,
    shadowColor: c.sageDark,
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
  },
  cornerTL: {
    top: -4,
    left: -4,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  cornerTR: {
    top: -4,
    right: -4,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  cornerBL: {
    bottom: -4,
    left: -4,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  cornerBR: {
    bottom: -4,
    right: -4,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },

  scanLine: {
    position: "absolute",
    top: 16,
    left: 24,
    right: 24,
    height: 2,
    flexDirection: "row",
    shadowColor: c.sageDark,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 16,
  },
  scanLineFadeL: { flex: 1, backgroundColor: "rgba(75,101,70,0)" },
  scanLineCore: { width: 80, backgroundColor: c.sageDark },
  scanLineFadeR: { flex: 1, backgroundColor: "rgba(75,101,70,0)" },

  guidance: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    alignItems: "center",
  },
  guidanceText: {
    fontFamily: f.bodyMed,
    fontSize: 13,
    color: c.textDark,
    letterSpacing: 0.3,
    lineHeight: 19,
  },

  actionsRow: {
    marginTop: 32,
    marginHorizontal: 24,
    flexDirection: "row",
    gap: 16,
  },
  actionBtnWrap: { flex: 1 },
  actionBtn: {
    paddingVertical: 24,
    paddingHorizontal: 14,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 2,
  },
  actionLabel: {
    fontFamily: f.bodyBold,
    fontSize: 12,
    color: c.textDark,
    letterSpacing: -0.3,
    textAlign: "center",
  },

  historyHeader: {
    marginTop: 56,
    marginHorizontal: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  historyTitle: {
    fontFamily: f.displayBold,
    fontSize: 28,
    color: c.textDark,
    letterSpacing: -0.7,
    lineHeight: 38,
  },
  seeAll: { paddingHorizontal: 8, alignItems: "center" },
  seeAllText: {
    fontFamily: f.bodyBold,
    fontSize: 14,
    color: c.sageDark,
    textAlign: "center",
    lineHeight: 20,
  },

  historyList: { marginTop: 32, paddingHorizontal: 24, gap: 24 },
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    padding: 20,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 3,
  },
  historyImgBox: {
    width: 88,
    height: 88,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  historyImg: { width: "100%", height: "100%" },
  historyTextWrap: { flex: 1, gap: 4 },
  historyTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  historyName: {
    flex: 1,
    fontFamily: f.displayBold,
    fontSize: 18,
    color: c.textDark,
    lineHeight: 26,
  },
  historyAgo: {
    paddingTop: 4,
    fontFamily: f.bodyMed,
    fontSize: 12,
    color: c.textDim,
    opacity: 0.4,
  },
  historyMeta: {
    fontFamily: f.bodyMed,
    fontSize: 13,
    color: c.textDim,
    lineHeight: 19,
  },
  historyTag: {
    alignSelf: "flex-start",
    marginTop: 6,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
  },
  historyTagText: {
    fontFamily: f.bodyBold,
    fontSize: 10,
    letterSpacing: 1,
  },
});
