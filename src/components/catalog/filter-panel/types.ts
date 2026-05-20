import type { Recipe } from "../../../types";
import type { CatalogFilters } from "../../../pages/catalog-page/types";

export interface FilterPanelProps {
  recipes: Recipe[];
  filters: CatalogFilters;
  onChange: (_filters: CatalogFilters) => void;
  onReset: () => void;
  isResettable: boolean;
}
