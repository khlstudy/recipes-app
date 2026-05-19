import type { Recipe, UserProfile } from "../../types/index";
import {
  getPersonalizedRecommendations,
  getTopRatedRecipes,
} from "../../utils/recommendations";

export const RECOMMENDATIONS_LIMIT = 6;
export const TOP_RECIPES_LIMIT = 6;

export const ONBOARDING_STEPS = [
  "Browse or search recipes by ingredient, tag, or diet",
  "Save favorites and build your personal collection",
  "Use Smart Matcher to cook with what you already have",
] as const;

export const computeFeed = (
  recipes: Recipe[],
  userProfile: UserProfile | null
): { recommendations: Recipe[]; topRecipes: Recipe[] } => ({
  recommendations:
    userProfile && recipes.length > 0
      ? getPersonalizedRecommendations(
          recipes,
          userProfile,
          RECOMMENDATIONS_LIMIT
        )
      : [],
  topRecipes:
    recipes.length > 0 ? getTopRatedRecipes(recipes, TOP_RECIPES_LIMIT) : [],
});
