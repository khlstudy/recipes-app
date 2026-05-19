import type { ScaleOption } from "./types";

export const SCALE_OPTIONS: ScaleOption[] = [
  { key: "half", value: 0.5, label: "0.5x" },
  { key: "single", value: 1, label: "1x" },
  { key: "double", value: 2, label: "2x" },
];

export const formatAmount = (amount: number, scale: number): string => {
  const scaled = amount * scale;
  if (Number.isInteger(scaled)) return String(scaled);
  return scaled.toFixed(2).replace(/\.?0+$/, "");
};
