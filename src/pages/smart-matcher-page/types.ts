import type { MatchFilterValue } from "../../components/smart-matcher/match-filter/types";

export interface SmartMatcherState {
  pantry: string[];
  filter: MatchFilterValue;
}
