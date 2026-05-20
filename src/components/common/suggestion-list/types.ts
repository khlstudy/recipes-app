export interface SuggestionItem {
  value: string;
  type?: string;
}

export interface SuggestionListProps {
  suggestions: Array<string | SuggestionItem>;
  onSelect: (_value: string, _type?: string) => void;
  maxVisible?: number;
}
