import type { Recipe } from "../../../types";
import type { BoardTab } from "../../../pages/profile-page/types";

export interface FavoritesBoardProps {
  tabs: BoardTab[];
  recipeMap: Record<string, Recipe>;
  activeTabId: string;
  favoriteIds: string[];
  comparisonIds: string[];
  onSelect: (_tabId: string) => void;
  onOpenRecipe: (_recipeId: string) => void;
  onFavoriteToggle: (_recipeId: string) => void;
  onCompareToggle: (_recipe: Recipe) => void;
  canEdit?: boolean;
  onEdit?: (_recipe: Recipe) => void;
  onDelete?: (_recipeId: string) => void;
  onClearActive?: (_tabId: string) => void;
  dislikedIngredients?: string[];
}
