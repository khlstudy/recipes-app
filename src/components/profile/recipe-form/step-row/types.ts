import type { StepDraft } from "../types";

export interface StepRowProps {
  step: StepDraft;
  index: number;
  isLastRemaining: boolean;
  onChange: (_value: string) => void;
  onRemove: () => void;
}
