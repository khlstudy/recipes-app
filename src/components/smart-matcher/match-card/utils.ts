import type { MatchedRecipe, MatchTier } from "../../../types/index";
import type { IngredientGroup } from "./types";

export const TIER_LABEL: Record<MatchTier, string> = {
  ready: "Ready to cook",
  almost: "Almost there",
  explore: "Worth exploring",
};

export const getIngredientGroups = (
  match: MatchedRecipe
): IngredientGroup[] => [
  {
    key: "have",
    title: "You have",
    modifier: "have",
    items: match.matchedIngredients,
  },
  {
    key: "missing",
    title: "Still need",
    modifier: "missing",
    items: match.missingIngredients,
  },
];

export const formatOverlap = (matchPercentage: number): string =>
  `Overlap score ${Math.round(matchPercentage)}%`;
