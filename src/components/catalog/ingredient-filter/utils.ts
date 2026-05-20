export const MAX_SUGGESTIONS = 20;

export const matchSuggestions = (
  suggestions: string[],
  selected: string[],
  query: string
): string[] => {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const taken = new Set(selected.map((s) => s.toLowerCase()));
  return suggestions
    .filter((s) => !taken.has(s.toLowerCase()) && s.toLowerCase().includes(q))
    .slice(0, MAX_SUGGESTIONS);
};
