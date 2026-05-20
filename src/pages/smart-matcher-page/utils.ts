import type { Recipe } from "../../types";
import { normalizeIngredient } from "../../utils/ingredient-normalization";
import { DEFAULT_FILTER } from "../../components/smart-matcher/match-filter/utils";
import type { MatchFilterValue } from "../../components/smart-matcher/match-filter/types";
import type { SmartMatcherState } from "./types";

export const DEFAULT_STATE: SmartMatcherState = {
  pantry: [],
  filter: DEFAULT_FILTER,
};

// The pantry is persisted so navigating to a recipe and back does not wipe what
// the user typed in. Stored in sessionStorage: it should survive in-app
// navigation but not linger as stale state across separate visits.
const PANTRY_STORAGE_KEY = "smart_matcher_pantry";

export const loadPantry = (): string[] => {
  try {
    const raw = sessionStorage.getItem(PANTRY_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
};

export const savePantry = (pantry: string[]): void => {
  try {
    sessionStorage.setItem(PANTRY_STORAGE_KEY, JSON.stringify(pantry));
  } catch {
    // sessionStorage unavailable — keep in-memory state only
  }
};

// Suggestions are canonical names drawn from the recipe data through the same
// normalization the matcher uses — so whatever the user picks always lines up
// with how ingredients are compared.
export const getPantrySuggestions = (recipes: Recipe[]): string[] => {
  const seen = new Set<string>();
  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) {
      seen.add(normalizeIngredient(ingredient.name));
    }
  }
  return [...seen].sort();
};

const EMPTY_BY_FILTER: Record<MatchFilterValue, string> = {
  ready:
    "No recipe is fully covered yet. Check “Almost there” or add more ingredients.",
  almost: "Nothing is one or two ingredients away. Try “Worth exploring”.",
  explore: "No further matches — see the other tabs.",
  all: "Nothing matches yet. Add what else you have on hand.",
};

export const getEmptyMessage = (
  pantryCount: number,
  filter: MatchFilterValue
): string =>
  pantryCount === 0
    ? "Add a few ingredients above to see what you can cook."
    : EMPTY_BY_FILTER[filter];
