import type { Recipe } from "../../../types/index";

export interface RecipeMetaProps {
  recipe: Recipe;
}

export interface MetaItem {
  key: string;
  iconId: string;
  value: string;
}
