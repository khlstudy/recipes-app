import type { Recipe } from "../../types";
import { applyFilters, searchRecipes } from "../../utils/recommendations";
import type {
  CatalogFilters,
  Difficulty,
  FacetOption,
  SortKey,
  SortOption,
} from "./types";

export const COOKING_TIME = {
  min: 10,
  max: 180,
  step: 5,
} as const;

export const DEFAULT_FILTERS: CatalogFilters = {
  diet: [],
  difficulty: [],
  maxTime: COOKING_TIME.max,
  ingredients: [],
};

export const DIFFICULTY_OPTIONS: FacetOption[] = [
  { key: "easy", label: "Easy" },
  { key: "medium", label: "Medium" },
  { key: "hard", label: "Hard" },
];

export const SORT_OPTIONS: SortOption[] = [
  { key: "rating", label: "Highest rated" },
  { key: "cookingTime", label: "Quickest to cook" },
  { key: "calories", label: "Lowest calories" },
];

const SORT_VALUE: Record<SortKey, (_recipe: Recipe) => number> = {
  rating: (r) => -r.rating.value,
  cookingTime: (r) => r.cookingTime,
  calories: (r) => r.nutrition.calories,
};

export const getDietOptions = (recipes: Recipe[]): FacetOption[] => {
  const seen = new Set<string>();
  for (const recipe of recipes) {
    for (const diet of recipe.diet ?? []) seen.add(diet);
  }
  return [...seen]
    .sort()
    .map((key) => ({ key, label: capitalize(key.replace(/-/g, " ")) }));
};

export const getIngredientSuggestions = (recipes: Recipe[]): string[] => {
  const seen = new Set<string>();
  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) {
      seen.add(ingredient.name.toLowerCase());
    }
  }
  return [...seen].sort();
};

export const countByDiet = (recipes: Recipe[], diet: string): number =>
  recipes.filter((r) => r.diet?.includes(diet)).length;

export const countByDifficulty = (
  recipes: Recipe[],
  difficulty: Difficulty
): number => recipes.filter((r) => r.difficulty === difficulty).length;

export const isDefaultFilters = (filters: CatalogFilters): boolean =>
  filters.diet.length === 0 &&
  filters.difficulty.length === 0 &&
  filters.ingredients.length === 0 &&
  filters.maxTime === COOKING_TIME.max;

export const getCatalogResults = (
  recipes: Recipe[],
  search: string,
  filters: CatalogFilters,
  sortBy: SortKey
): Recipe[] => {
  let result = searchRecipes(recipes, search);
  result = applyFilters(result, {
    diet: filters.diet,
    difficulty: filters.difficulty,
    ingredients: filters.ingredients,
    maxTime: filters.maxTime < COOKING_TIME.max ? filters.maxTime : undefined,
  });
  const valueOf = SORT_VALUE[sortBy];
  return [...result].sort((a, b) => valueOf(a) - valueOf(b));
};

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
