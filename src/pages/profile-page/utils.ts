import type { Collection, Recipe } from "../../types";
import type {
  ProfileTabSchema,
  PreferenceGroupSchema,
  PreferenceGroupKey,
  BoardTab,
} from "./types";
import { PROFILE_TAB, FAVORITES_TAB_ID, HISTORY_TAB_ID } from "./types";
import { RECIPE_ICON_IDS } from "../../components/common/recipe-card/utils";

export const PROFILE_TABS: ProfileTabSchema[] = [
  {
    key: PROFILE_TAB.SETTINGS,
    label: "Settings",
    description: "Your personal information",
    iconId: RECIPE_ICON_IDS.chef,
    adminOnly: false,
  },
  {
    key: PROFILE_TAB.PREFERENCES,
    label: "Preferences",
    description: "Tune your recommendations",
    iconId: RECIPE_ICON_IDS.salad,
    adminOnly: false,
  },
  {
    key: PROFILE_TAB.FAVORITES,
    label: "Favorites",
    description: "Saved recipes & view history",
    iconId: RECIPE_ICON_IDS.heart,
    adminOnly: false,
  },
  {
    key: PROFILE_TAB.ADMIN,
    label: "Create",
    description: "Publish a new recipe",
    iconId: RECIPE_ICON_IDS.add,
    adminOnly: true,
  },
];

export const PREFERENCE_GROUPS: PreferenceGroupSchema[] = [
  {
    key: "favoriteTags",
    title: "Favorite Tags",
    iconId: RECIPE_ICON_IDS.star,
    hint: "Cuisines and styles we should prioritize for you.",
    placeholder: "Add a tag",
  },
  {
    key: "dietaryRestrictions",
    title: "Dietary Restrictions",
    iconId: RECIPE_ICON_IDS.salad,
    hint: "Diets every recommendation must respect.",
    placeholder: "Add a restriction",
  },
  {
    key: "dislikedIngredients",
    title: "Unwanted Ingredients",
    iconId: RECIPE_ICON_IDS.delete,
    hint: "Ingredients to keep out of your feed.",
    placeholder: "Add an ingredient",
  },
];

export const getFavoriteIds = (collections: Collection[]): string[] =>
  collections.find((col) => col.name === "Favorites" && col.isDefault)
    ?.recipeIds ?? [];

// The Favorites tab shows two read-only sections: the user's favorited
// recipes and their viewing history.
export const buildFavoritesTabs = (
  collections: Collection[],
  viewHistory: string[]
): BoardTab[] => [
  {
    id: FAVORITES_TAB_ID,
    name: "Favorites",
    iconId: RECIPE_ICON_IDS.heart,
    recipeIds: getFavoriteIds(collections),
    emptyMessage:
      "No favorites yet. Tap the heart on any recipe to save it here.",
  },
  {
    id: HISTORY_TAB_ID,
    name: "Viewing History",
    iconId: RECIPE_ICON_IDS.clock,
    recipeIds: viewHistory,
    emptyMessage:
      "No recipes viewed yet. Open a recipe and it will appear here.",
  },
];

export const buildRecipeMap = (recipes: Recipe[]): Record<string, Recipe> =>
  recipes.reduce<Record<string, Recipe>>((map, recipe) => {
    map[recipe.id] = recipe;
    return map;
  }, {});

export const resolveRecipes = (
  ids: string[],
  recipeMap: Record<string, Recipe>
): Recipe[] =>
  ids.map((id) => recipeMap[id]).filter((recipe): recipe is Recipe => !!recipe);

export const normalizeChip = (value: string): string =>
  value.trim().toLowerCase();

export const POPULAR_PICKS_LIMIT = 8;

// Unique values ranked by how often they appear across all recipes, so the
// most common options surface first in both the dropdown and Quick Pick.
const collectByFrequency = (lists: (string[] | undefined)[]): string[] => {
  const counts = new Map<string, number>();
  lists
    .flatMap((list) => list ?? [])
    .forEach((value) => {
      const key = normalizeChip(value);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([value]) => value);
};

export const collectTagPool = (recipes: Recipe[]): string[] =>
  collectByFrequency(recipes.map((recipe) => recipe.tags));

export const collectDietPool = (recipes: Recipe[]): string[] =>
  collectByFrequency(recipes.map((recipe) => recipe.diet));

export const collectIngredientPool = (recipes: Recipe[]): string[] =>
  collectByFrequency(
    recipes.map((recipe) => recipe.ingredients.map((ing) => ing.name))
  );

export const collectUnitPool = (recipes: Recipe[]): string[] =>
  collectByFrequency(
    recipes.map((recipe) => recipe.ingredients.map((ing) => ing.unit))
  );

export type PreferenceSuggestionPools = Record<PreferenceGroupKey, string[]>;

export const buildPreferencePools = (
  recipes: Recipe[]
): PreferenceSuggestionPools => ({
  favoriteTags: collectTagPool(recipes),
  dietaryRestrictions: collectDietPool(recipes),
  dislikedIngredients: collectIngredientPool(recipes),
});

export const visibleTabs = (isAdmin: boolean): ProfileTabSchema[] =>
  PROFILE_TABS.filter((tab) => !tab.adminOnly || isAdmin);
