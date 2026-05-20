import type { RefObject } from "react";

import type { SuggestionItem } from "../suggestion-list/types";

export interface SearchProps {
  onSearch: (_query: string, _type?: string) => void;
  onCommitSearch?: (_query: string) => void;
  placeholder?: string;
  initialValue?: string;
  suggestions?: SuggestionItem[];
  inputRef?: RefObject<HTMLInputElement | null>;
  recentSearches?: string[];
  trendingSearches?: string[];
  onClearRecent?: () => void;
}
