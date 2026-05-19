import type { Ingredient } from "../../../types";

export const SCALE_VALUES = [0.5, 1, 2] as const;
export type ScaleValue = (typeof SCALE_VALUES)[number];

export interface ScaleOption {
  key: string;
  value: ScaleValue;
  label: string;
}

export interface IngredientListProps {
  ingredients: Ingredient[];
}
