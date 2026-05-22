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

// Guests and brand-new users have no signal to personalize from, so the
// "Recommended For You" rail falls back to highly-rated recipes. It becomes
// genuinely personalized once the user logs in and starts interacting.
const getFallbackRecommendations = (recipes: Recipe[]): Recipe[] =>
  getTopRatedRecipes(recipes, TOP_RECIPES_LIMIT + RECOMMENDATIONS_LIMIT).slice(
    TOP_RECIPES_LIMIT
  );

export const computeFeed = (
  recipes: Recipe[],
  userProfile: UserProfile | null
): {
  recommendations: Recipe[];
  isPersonalized: boolean;
  topRecipes: Recipe[];
} => {
  if (recipes.length === 0) {
    return { recommendations: [], isPersonalized: false, topRecipes: [] };
  }

  const personalized = userProfile
    ? getPersonalizedRecommendations(
        recipes,
        userProfile,
        RECOMMENDATIONS_LIMIT
      )
    : [];

  const isPersonalized = personalized.length > 0;

  return {
    recommendations: isPersonalized
      ? personalized
      : getFallbackRecommendations(recipes),
    isPersonalized,
    topRecipes: getTopRatedRecipes(recipes, TOP_RECIPES_LIMIT),
  };
};
