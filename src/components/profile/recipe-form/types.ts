import type { CreateRecipeRequest } from "../../../api/types";

export type StepKey =
  | "basic"
  | "ingredients"
  | "steps"
  | "nutrition"
  | "tags"
  | "diet";

export const DIFFICULTY_OPTIONS = ["easy", "medium", "hard"] as const;

export type DifficultyOption = (typeof DIFFICULTY_OPTIONS)[number];

export interface IngredientDraft {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

export interface StepDraft {
  id: string;
  text: string;
}

export interface RecipeFormState {
  title: string;
  description: string;
  cookingTime: string;
  servings: string;
  difficulty: DifficultyOption | null;
  imageUrl: string;
  ingredients: IngredientDraft[];
  steps: StepDraft[];
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  tags: string[];
  diet: string[];
}

export interface BasicFieldSchema {
  key: "title" | "description" | "imageUrl";
  label: string;
  placeholder: string;
  caption: string;
  multiline?: boolean;
  minLength?: number;
  maxLength?: number;
}

export interface NumberFieldSchema {
  key: "cookingTime" | "servings";
  label: string;
  placeholder: string;
  unit: string;
  maxLength: number;
}

export interface NutritionFieldSchema {
  key: "calories" | "protein" | "carbs" | "fat";
  label: string;
  unit: string;
  maxLength: number;
}

export const INGREDIENT_AMOUNT_MAX_LENGTH = 5;

export const DESCRIPTION_MAX_LENGTH = 130;
export const STEP_MAX_LENGTH = 90;
export const INGREDIENT_NAME_MAX_LENGTH = 40;
export const INGREDIENT_UNIT_MAX_LENGTH = 16;

export interface RecipeFormProps {
  submitting: boolean;
  tagPool: string[];
  dietPool: string[];
  ingredientPool: string[];
  unitPool: string[];
  onSubmit: (_recipe: CreateRecipeRequest) => void;
  initialState?: RecipeFormState;
  mode?: "create" | "edit";
  submitLabel?: string;
  submittingLabel?: string;
}
