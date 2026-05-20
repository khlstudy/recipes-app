import type { MatchedRecipe } from "../../../types/index";

export interface MatchResultsProps {
  matches: MatchedRecipe[];
  onRecipeClick: (_recipeId: string) => void;
  emptyMessage: string;
}
