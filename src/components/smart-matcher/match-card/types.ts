import type { MatchedRecipe } from "../../../types/index";

export interface MatchCardProps {
  match: MatchedRecipe;
  onClick: () => void;
}

export interface IngredientGroup {
  key: "have" | "missing";
  title: string;
  modifier: string;
  items: string[];
}
