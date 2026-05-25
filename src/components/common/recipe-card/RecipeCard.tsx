import type { MouseEvent } from "react";

import type { RecipeCardProps } from "./types";
import { ICONS_PATH, RECIPE_ICON_IDS, MAX_VISIBLE_TAGS } from "./utils";
import IconButton from "../icon-button/IconButton";
import RecipeMeta from "../recipe-meta/RecipeMeta";

import styles from "./RecipeCard.module.scss";

const DISLIKED_VISIBLE = 2;

const RecipeCard = ({
  recipe,
  onClick,
  onFavoriteToggle,
  isFavorite = false,
  onCompareToggle,
  isInComparison = false,
  onEdit,
  onDelete,
  canEdit = false,
  dislikedMatches = [],
}: RecipeCardProps) => {
  const dislikedVisible = dislikedMatches.slice(0, DISLIKED_VISIBLE);
  const dislikedExtra = dislikedMatches.length - dislikedVisible.length;
  const dislikedLabel = dislikedMatches.length
    ? `Contains ingredients you marked as unwanted: ${dislikedMatches.join(", ")}`
    : undefined;
  const handleFavorite = (e: MouseEvent) => {
    e.stopPropagation();
    onFavoriteToggle?.(recipe.id);
  };

  const handleCompare = (e: MouseEvent) => {
    e.stopPropagation();
    onCompareToggle?.(recipe);
  };

  const handleEdit = (e: MouseEvent) => {
    e.stopPropagation();
    onEdit?.(recipe);
  };

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    onDelete?.(recipe.id);
  };

  return (
    <article className={styles["recipe-card"]} onClick={onClick}>
      <div className={styles["recipe-card__image-wrapper"]}>
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className={styles["recipe-card__image"]}
        />

        {dislikedMatches.length > 0 && (
          <span
            className={styles["recipe-card__warning"]}
            title={dislikedLabel}
            aria-label={dislikedLabel}>
            <span className={styles["recipe-card__warning-icon"]} aria-hidden>
              !
            </span>
            <span className={styles["recipe-card__warning-text"]}>
              {dislikedVisible.join(", ")}
              {dislikedExtra > 0 && ` +${dislikedExtra}`}
            </span>
          </span>
        )}

        <div className={styles["recipe-card__overlay-actions"]}>
          <IconButton
            variant="circle"
            active={isFavorite}
            iconSrc={`${ICONS_PATH}${isFavorite ? RECIPE_ICON_IDS.heart : RECIPE_ICON_IDS.heartNeutral}`}
            label="favorite"
            onClick={handleFavorite}
          />
          <IconButton
            variant="circle"
            active={isInComparison}
            iconSrc={`${ICONS_PATH}${isInComparison ? RECIPE_ICON_IDS.check : RECIPE_ICON_IDS.scales}`}
            label="compare"
            onClick={handleCompare}
          />
          {canEdit && (
            <>
              <IconButton
                variant="circle"
                iconSrc={`${ICONS_PATH}${RECIPE_ICON_IDS.edit}`}
                label={`Edit ${recipe.title}`}
                onClick={handleEdit}
              />
              <IconButton
                variant="circle"
                iconSrc={`${ICONS_PATH}${RECIPE_ICON_IDS.delete}`}
                label={`Delete ${recipe.title}`}
                onClick={handleDelete}
              />
            </>
          )}
        </div>
      </div>

      <div className={styles["recipe-card__content"]}>
        <div className={styles["recipe-card__header"]}>
          <h3 className={styles["recipe-card__title"]}>{recipe.title}</h3>
        </div>

        <p className={styles["recipe-card__description"]}>
          {recipe.description}
        </p>

        <RecipeMeta recipe={recipe} />

        {recipe.tags.length > 0 && (
          <div className={styles["recipe-card__tags"]}>
            {recipe.tags.slice(0, MAX_VISIBLE_TAGS).map((tag) => (
              <span key={tag} className={styles["recipe-card__tag"]}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className={styles["recipe-card__nutrition"]}>
          <span className={styles["recipe-card__nutrition-item"]}>
            {recipe.nutrition.calories} kcal
          </span>
          <span className={styles["recipe-card__nutrition-item"]}>
            P: {recipe.nutrition.protein}g
          </span>
          <span className={styles["recipe-card__nutrition-item"]}>
            C: {recipe.nutrition.carbs}g
          </span>
          <span className={styles["recipe-card__nutrition-item"]}>
            F: {recipe.nutrition.fat}g
          </span>
        </div>
      </div>
    </article>
  );
};

export default RecipeCard;
