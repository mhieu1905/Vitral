import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  initialStartTime?: string;
  initialEndTime?: string;
  initialAwakeMinutes?: number;
  initialQuality?: number;
  onClose: () => void;
  onConfirm: (v: {
    start_time: string;
    end_time: string;
    awake_minutes: number;
    quality_user: number;
  }) => void;
};

function clampInt(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function isHHMM(value: string) {
  return /^\d{2}:\d{2}$/.test(value);
}

export function AddSleepSheet({
  visible,
  initialStartTime = "23:30",
  initialEndTime = "06:30",
  initialAwakeMinutes = 0,
  initialQuality = 4,
  onClose,
  onConfirm,
}: Props) {
  const [mounted, setMounted] = useState(visible);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [awakeMinutes, setAwakeMinutes] = useState(String(initialAwakeMinutes));
  const [quality, setQuality] = useState(initialQuality);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      setStartTime(initialStartTime);
      setEndTime(initialEndTime);
      setAwakeMinutes(String(initialAwakeMinutes));
      setQuality(initialQuality);
    } else {
      setMounted(false);
    }
  }, [
    visible,
    initialStartTime,
    initialEndTime,
    initialAwakeMinutes,
    initialQuality,
  ]);

  const awakeInt = useMemo(() => {
    const n = parseInt(awakeMinutes, 10);
    return Number.isFinite(n) ? clampInt(n, 0, 600) : 0;
  }, [awakeMinutes]);

  const canSubmit = isHHMM(startTime) && isHHMM(endTime);

  if (!mounted) return null;

  return (
    <Modal transparent visible={mounted} onRequestClose={onClose}>
      <View style={s.root}>
        <Pressable style={s.backdrop} onPress={onClose} />

        <View style={s.sheet}>
          <View style={s.handle} />

          <View style={s.headerRow}>
            <Text style={s.title}>Log Sleep (Today)</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Text style={s.close}>Close</Text>
            </Pressable>
          </View>

          <Text style={s.label}>Sleep time (HH:MM)</Text>
          <View style={s.row}>
            <View style={s.field}>
              <Text style={s.fieldLabel}>From</Text>
              <TextInput
                value={startTime}
                onChangeText={setStartTime}
                placeholder="23:30"
                style={s.input}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="numbers-and-punctuation"
              />
            </View>
            <View style={s.field}>
              <Text style={s.fieldLabel}>To</Text>
              <TextInput
                value={endTime}
                onChangeText={setEndTime}
                placeholder="06:30"
                style={s.input}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="numbers-and-punctuation"
              />
            </View>
          </View>

          <Text style={s.label}>Awake minutes (optional)</Text>
          <TextInput
            value={awakeMinutes}
            onChangeText={setAwakeMinutes}
            placeholder="0"
            style={s.input}
            keyboardType="number-pad"
          />

          <Text style={s.label}>Quality (1–5)</Text>
          <View style={s.qualityRow}>
            <Pressable
              onPress={() => setQuality((q) => clampInt(q - 1, 1, 5))}
              style={s.qualityBtn}
            >
              <Text style={s.qualityBtnText}>-</Text>
            </Pressable>
            <Text style={s.qualityValue}>{quality}</Text>
            <Pressable
              onPress={() => setQuality((q) => clampInt(q + 1, 1, 5))}
              style={s.qualityBtn}
            >
              <Text style={s.qualityBtnText}>+</Text>
            </Pressable>
          </View>

          <Pressable
            disabled={!canSubmit}
            onPress={() =>
              onConfirm({
                start_time: startTime,
                end_time: endTime,
                awake_minutes: awakeInt,
                quality_user: quality,
              })
            }
            style={[s.cta, !canSubmit && { opacity: 0.5 }]}
          >
            <Text style={s.ctaText}>Save</Text>
          </Pressable>

          <Text style={s.hint}>
            Tip: If “To” is earlier than “From”, it counts as next day.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
  },
  handle: {
    alignSelf: "center",
    width: 44,
    height: 4,
    borderRadius: 999,
    backgroundColor: "rgba(196,181,172,0.45)",
    marginBottom: 18,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 16, fontWeight: "700", color: "#3D3027" },
  close: { fontSize: 12, fontWeight: "700", color: "#6B5C52" },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B5C52",
    marginTop: 10,
    marginBottom: 8,
  },
  row: { flexDirection: "row", gap: 12 },
  field: { flex: 1 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6B5C52",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(107, 92, 82, 0.25)",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#3D3027",
    backgroundColor: "#FFF1E9",
  },
  qualityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 4,
  },
  qualityBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF1E9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(107, 92, 82, 0.18)",
  },
  qualityBtnText: { fontSize: 18, fontWeight: "800", color: "#3D3027" },
  qualityValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#3D3027",
    minWidth: 24,
    textAlign: "center",
  },
  cta: {
    marginTop: 16,
    backgroundColor: "#4C6647",
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: "center",
  },
  ctaText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  hint: { marginTop: 10, fontSize: 11, color: "#6B5C52", opacity: 0.85 },
});
