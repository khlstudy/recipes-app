import type { SortKey, SortOption } from "../../../pages/catalog-page/types";

export interface CatalogToolbarProps {
  resultCount: number;
  searchQuery: string;
  searchType: string;
  sortBy: SortKey;
  sortOptions: SortOption[];
  onSortChange: (_sortBy: SortKey) => void;
  onOpenFilters: () => void;
  onFocusSearch: () => void;
}
