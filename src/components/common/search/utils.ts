import type { SuggestionItem } from "../suggestion-list/types";

export const MAX_SUGGESTIONS = 20;
export const MIN_QUERY_LENGTH = 2;

export const matchSuggestions = (
  suggestions: SuggestionItem[],
  query: string
): SuggestionItem[] => {
  const q = query.toLowerCase().trim();
  if (q.length < MIN_QUERY_LENGTH) return [];
  return suggestions
    .filter((s) => s.value.toLowerCase().includes(q))
    .slice(0, MAX_SUGGESTIONS);
};
