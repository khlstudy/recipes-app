import type { InputHTMLAttributes } from "react";

export const INPUT_TONES = ["default", "complete"] as const;
export type InputTone = (typeof INPUT_TONES)[number];

export const INPUT_SURFACES = ["muted", "raised"] as const;
export type InputSurface = (typeof INPUT_SURFACES)[number];

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id"
> {
  name: string;
  label: string;
  caption?: string;
  error?: string;
  tone?: InputTone;
  surface?: InputSurface;
  requiredMark?: boolean;
}
