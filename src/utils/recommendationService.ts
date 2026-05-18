import type { Recipe, MatchedRecipe, UserProfile } from "../types";
import {
  smartMatchByIngredients,
  getPersonalizedRecommendations,
  getTopRatedRecipes,
} from "./recommendations";

export function matchByIngredients(
  recipes: Recipe[],
  ingredients: string[],
  minMatchPercentage = 50
): MatchedRecipe[] {
  return smartMatchByIngredients(recipes, ingredients, minMatchPercentage);
}

export function getRecommendations(
  recipes: Recipe[],
  profile: UserProfile,
  limit = 6
): { personalized: Recipe[]; topRated: Recipe[] } {
  return {
    personalized: getPersonalizedRecommendations(recipes, profile, limit),
    topRated: getTopRatedRecipes(recipes, limit),
  };
}
