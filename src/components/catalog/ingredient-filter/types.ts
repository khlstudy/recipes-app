export interface IngredientFilterProps {
  ingredients: string[];
  suggestions: string[];
  onAdd: (_ingredient: string) => void;
  onRemove: (_ingredient: string) => void;
}
