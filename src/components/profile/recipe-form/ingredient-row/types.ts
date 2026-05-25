import type { IngredientDraft } from "../types";

export interface IngredientRowProps {
  ingredient: IngredientDraft;
  index: number;
  isLastRemaining: boolean;
  nameSuggestions: string[];
  unitSuggestions: string[];
  isActiveName: boolean;
  isActiveUnit: boolean;
  onActivateName: () => void;
  onDeactivateName: () => void;
  onActivateUnit: () => void;
  onDeactivateUnit: () => void;
  onChange: (_key: "name" | "amount" | "unit", _value: string) => void;
  onSelectSuggestion: (_key: "name" | "unit", _value: string) => void;
  onRemove: () => void;
}
