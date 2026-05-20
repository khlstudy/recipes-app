export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Step {
  text: string;
  timer?: number;
}

export interface Rating {
  value: number;
  count: number;
}

export interface Comment {
  id: string;
  recipeId: string;
  userId: string;
  text: string;
  rating: number;
  createdAt: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  steps: Step[];
  nutrition: Nutrition;
  tags: string[];
  diet?: string[];
  rating: Rating;
  imageUrl: string;
  cookingTime: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  favoriteTags: string[];
  dietaryRestrictions: string[];
  dislikedIngredients: string[];
}

export interface Collection {
  id: string;
  name: string;
  recipeIds: string[];
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
  viewHistory: string[];
  collections: Collection[];
}

export interface FilterOptions {
  ingredients?: string[];
  diet?: string[];
  maxTime?: number;
  difficulty?: ("easy" | "medium" | "hard")[];
  tags?: string[];
}

export const MATCH_TIERS = ["ready", "almost", "explore"] as const;

export type MatchTier = (typeof MATCH_TIERS)[number];

export interface MatchedRecipe {
  recipe: Recipe;
  matchPercentage: number;
  coverage: number;
  tier: MatchTier;
  matchedIngredients: string[];
  missingIngredients: string[];
}

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  token: string;
};
