export interface ChipGroupProps {
  values: string[];
  placeholder: string;
  emptyLabel: string;
  onAdd: (_value: string) => void;
  onRemove: (_value: string) => void;
  suggestions?: string[];
  quickPicks?: string[];
  quickPickLabel?: string;
  disabled?: boolean;
  suggestionsMaxVisible?: number;
}
