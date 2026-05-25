export const STATUS_PILL_TONES = ["done", "in-progress"] as const;

export type StatusPillTone = (typeof STATUS_PILL_TONES)[number];

export interface StatusPillProps {
  tone: StatusPillTone;
  label: string;
  className?: string;
}
