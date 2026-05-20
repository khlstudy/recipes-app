import type { Recipe } from "../../../types";
import type { SuggestionItem } from "../suggestion-list/types";
import { getTopRatedRecipes } from "../../../utils/recommendations";

export const TRENDING_SEARCHES_LIMIT = 4;

export const getTrendingSearches = (recipes: Recipe[]): string[] =>
  getTopRatedRecipes(recipes, TRENDING_SEARCHES_LIMIT).map(
    (recipe) => recipe.title
  );

export const buildSearchSuggestions = (recipes: Recipe[]): SuggestionItem[] => {
  const recipeItems: SuggestionItem[] = recipes.map((recipe) => ({
    value: recipe.title,
    type: "recipe",
  }));

  const ingredients = new Set<string>();
  const tags = new Set<string>();
  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) {
      ingredients.add(ingredient.name.toLowerCase());
    }
    for (const tag of recipe.tags) tags.add(tag.toLowerCase());
  }

  const ingredientItems: SuggestionItem[] = [...ingredients].map((value) => ({
    value,
    type: "ingredient",
  }));
  const tagItems: SuggestionItem[] = [...tags].map((value) => ({
    value,
    type: "tag",
  }));

  return [...recipeItems, ...ingredientItems, ...tagItems];
};
