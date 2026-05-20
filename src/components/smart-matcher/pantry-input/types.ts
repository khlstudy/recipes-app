export interface PantryInputProps {
  ingredients: string[];
  suggestions: string[];
  onAdd: (_ingredient: string) => void;
  onRemove: (_ingredient: string) => void;
  onClear: () => void;
}
