import type { MatchedRecipe } from "../../../types/index";
import type { FilterPreset, MatchFilterValue } from "./types";

export const FILTER_PRESETS: FilterPreset[] = [
  { key: "ready", label: "Ready to cook" },
  { key: "almost", label: "Almost there" },
  { key: "explore", label: "Worth exploring" },
  { key: "all", label: "All matches" },
];

export const DEFAULT_FILTER: MatchFilterValue = "all";

export const countByTier = (
  matches: MatchedRecipe[]
): Record<MatchFilterValue, number> => ({
  ready: matches.filter((m) => m.tier === "ready").length,
  almost: matches.filter((m) => m.tier === "almost").length,
  explore: matches.filter((m) => m.tier === "explore").length,
  all: matches.length,
});

export const filterByPreset = (
  matches: MatchedRecipe[],
  value: MatchFilterValue
): MatchedRecipe[] =>
  value === "all" ? matches : matches.filter((m) => m.tier === value);
