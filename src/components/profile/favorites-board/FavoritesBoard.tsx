import Icon from "../../common/icon/Icon";
import RecipeGrid from "../../common/recipe-grid/RecipeGrid";
import { ICONS_PATH } from "../../common/recipe-card/utils";
import { classNames } from "../../../utils/classNames";
import { resolveRecipes } from "../../../pages/profile-page/utils";
import type { FavoritesBoardProps } from "./types";

import styles from "./FavoritesBoard.module.scss";

const FavoritesBoard = ({
  tabs,
  recipeMap,
  activeTabId,
  favoriteIds,
  comparisonIds,
  onSelect,
  onOpenRecipe,
  onFavoriteToggle,
  onCompareToggle,
  canEdit,
  onEdit,
  onDelete,
  onClearActive,
  dislikedIngredients,
}: FavoritesBoardProps) => {
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];
  const activeRecipes = activeTab
    ? resolveRecipes(activeTab.recipeIds, recipeMap)
    : [];
  const canClearActive = Boolean(
    onClearActive && activeTab && activeTab.recipeIds.length > 0
  );

  return (
    <div className={styles["favorites-board"]}>
      <div className={styles["favorites-board__bar"]}>
        <ul className={styles["favorites-board__tabs"]}>
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab?.id;
            return (
              <li key={tab.id}>
                <button
                  type="button"
                  className={classNames(
                    styles["favorites-board__tab"],
                    isActive && styles["favorites-board__tab--active"]
                  )}
                  onClick={() => onSelect(tab.id)}
                  aria-pressed={isActive}>
                  <Icon src={`${ICONS_PATH}${tab.iconId}`} size={15} />
                  <span>{tab.name}</span>
                  <span className={styles["favorites-board__count"]}>
                    {tab.recipeIds.length}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {canClearActive && activeTab && (
          <button
            type="button"
            className={styles["favorites-board__clear"]}
            onClick={() => onClearActive?.(activeTab.id)}>
            Clear all
          </button>
        )}
      </div>

      <RecipeGrid
        recipes={activeRecipes}
        onRecipeClick={(recipe) => onOpenRecipe(recipe.id)}
        onFavoriteToggle={onFavoriteToggle}
        favoriteRecipes={favoriteIds}
        onCompareToggle={onCompareToggle}
        comparisonRecipes={comparisonIds}
        canEdit={canEdit}
        onEdit={onEdit}
        onDelete={onDelete}
        dislikedIngredients={dislikedIngredients}
        emptyMessage={activeTab?.emptyMessage ?? "Nothing here yet."}
      />
    </div>
  );
};

export default FavoritesBoard;
