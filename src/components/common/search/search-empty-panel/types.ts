export interface SearchEmptyPanelProps {
  recentSearches: string[];
  trendingSearches: string[];
  onSelectSearch: (_query: string, _type?: string) => void;
  onClearRecent: () => void;
}
