import type { MatchTier } from "../../../types/index";

export type MatchFilterValue = MatchTier | "all";

export interface MatchFilterProps {
  value: MatchFilterValue;
  counts: Record<MatchFilterValue, number>;
  onChange: (_value: MatchFilterValue) => void;
}

export interface FilterPreset {
  key: MatchFilterValue;
  label: string;
}
