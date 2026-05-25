import type { Recipe } from "../../../types/index";

export interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  onFavoriteToggle?: (_recipeId: string) => void;
  isFavorite?: boolean;
  onCompareToggle?: (_recipe: Recipe) => void;
  isInComparison?: boolean;
  onEdit?: (_recipe: Recipe) => void;
  onDelete?: (_recipeId: string) => void;
  canEdit?: boolean;
  dislikedMatches?: string[];
}
