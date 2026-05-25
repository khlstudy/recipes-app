import ProfileSection from "../profile-section/ProfileSection";
import FavoritesBoard from "../favorites-board/FavoritesBoard";
import { ICONS_PATH, RECIPE_ICON_IDS } from "../../common/recipe-card/utils";
import { buildFavoritesTabs } from "../../../pages/profile-page/utils";
import type { FavoritesTabProps } from "./types";

const FavoritesTab = ({
  profile,
  recipeMap,
  activeTabId,
  favoriteIds,
  comparisonIds,
  onSelectTab,
  onOpenRecipe,
  onFavoriteToggle,
  onCompareToggle,
  canEdit,
  onEdit,
  onDelete,
  onClearActive,
  dislikedIngredients,
}: FavoritesTabProps) => {
  const tabs = buildFavoritesTabs(profile.collections, profile.viewHistory);

  return (
    <ProfileSection
      title="Favorites & History"
      iconSrc={`${ICONS_PATH}${RECIPE_ICON_IDS.heart}`}
      subtitle="Recipes you saved and recently viewed.">
      <FavoritesBoard
        tabs={tabs}
        recipeMap={recipeMap}
        activeTabId={activeTabId}
        favoriteIds={favoriteIds}
        comparisonIds={comparisonIds}
        onSelect={onSelectTab}
        onOpenRecipe={onOpenRecipe}
        onFavoriteToggle={onFavoriteToggle}
        onCompareToggle={onCompareToggle}
        canEdit={canEdit}
        onEdit={onEdit}
        onDelete={onDelete}
        onClearActive={onClearActive}
        dislikedIngredients={dislikedIngredients}
      />
    </ProfileSection>
  );
};

export default FavoritesTab;
