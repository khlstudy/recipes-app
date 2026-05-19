import type { Recipe } from "../../../types";

export interface RecipeHeroProps {
  recipe: Recipe;
  isFavorite: boolean;
  onFavoriteToggle: (_recipeId: string) => void;
  onBack?: () => void;
}

export interface MetaItem {
  key: string;
  iconId: string;
  getValue: (_recipe: Recipe) => string;
}
