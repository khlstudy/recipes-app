import type { RecipeFormState } from "../types";

export interface BasicInfoSectionProps {
  form: RecipeFormState;
  onFieldChange: <K extends keyof RecipeFormState>(
    _key: K,
    _value: RecipeFormState[K]
  ) => void;
}
