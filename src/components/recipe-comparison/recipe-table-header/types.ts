import type { Recipe } from "../../../types/index";

export interface RecipeTableHeaderProps {
  recipe: Recipe;
  onRemove: (_recipeId: string) => void;
  className: string;
  mobile?: boolean;
}
