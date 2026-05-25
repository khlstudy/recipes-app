import type { Recipe } from "../../../types";

export interface RecipeHeroProps {
  recipe: Recipe;
  isFavorite: boolean;
  isAuthenticated: boolean;
  onFavoriteToggle: (_recipeId: string) => void;
  onViewFavorites: () => void;
  onBack?: () => void;
}

export interface MetaItem {
  key: string;
  iconId: string;
  getValue: (_recipe: Recipe) => string;
}
