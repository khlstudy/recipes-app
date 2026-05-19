import type { Recipe } from "../../../types/index";

export interface RecipeComparisonProps {
  recipes: Recipe[];
  onRemove: (_recipeId: string) => void;
}
