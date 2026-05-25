import type { RecipeGridProps } from "./types";
import RecipeCard from "../recipe-card/RecipeCard";
import { findDislikedMatches } from "../../../utils/recommendations";
import styles from "./RecipeGrid.module.scss";

const RecipeGrid = ({
  recipes,
  onRecipeClick,
  onFavoriteToggle,
  favoriteRecipes = [],
  title,
  emptyMessage = "No recipes found",
  onCompareToggle,
  comparisonRecipes = [],
  onEdit,
  onDelete,
  canEdit = false,
  dislikedIngredients = [],
}: RecipeGridProps) => {
  return (
    <section className={styles["recipe-grid"]}>
      {title && <h2 className={styles["recipe-grid__title"]}>{title}</h2>}

      {recipes.length === 0 ? (
        <p className={styles["recipe-grid__empty"]}>{emptyMessage}</p>
      ) : (
        <ul className={styles["recipe-grid__list"]}>
          {recipes.map((recipe) => (
            <li key={recipe.id} className={styles["recipe-grid__item"]}>
              <RecipeCard
                recipe={recipe}
                onClick={() => onRecipeClick(recipe)}
                onFavoriteToggle={onFavoriteToggle}
                isFavorite={favoriteRecipes.includes(recipe.id)}
                onCompareToggle={onCompareToggle}
                isInComparison={comparisonRecipes.includes(recipe.id)}
                onEdit={onEdit}
                onDelete={onDelete}
                canEdit={canEdit}
                dislikedMatches={findDislikedMatches(
                  recipe,
                  dislikedIngredients
                )}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default RecipeGrid;
