import type { CreateRecipeRequest } from "../../../api/types";
import type { Recipe } from "../../../types";

export type AdminMode = "create" | "edit";

export interface AdminTabProps {
  submitting: boolean;
  tagPool: string[];
  dietPool: string[];
  ingredientPool: string[];
  unitPool: string[];
  mode: AdminMode;
  editingRecipe: Recipe | null;
  onCreateRecipe: (_recipe: CreateRecipeRequest) => void;
  onUpdateRecipe: (_id: string, _recipe: CreateRecipeRequest) => void;
  onCancelEdit: () => void;
}
