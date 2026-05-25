import type { Recipe } from "../../../types/index";

export interface RecipeGridProps {
  recipes: Recipe[];
  onRecipeClick: (_recipe: Recipe) => void;
  onFavoriteToggle?: (_recipeId: string) => void;
  favoriteRecipes?: string[];
  title?: string;
  emptyMessage?: string;
  onCompareToggle?: (_recipe: Recipe) => void;
  comparisonRecipes?: string[];
  onEdit?: (_recipe: Recipe) => void;
  onDelete?: (_recipeId: string) => void;
  canEdit?: boolean;
  dislikedIngredients?: string[];
}
