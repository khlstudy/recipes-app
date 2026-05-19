import type { MouseEvent } from "react";

import type { RecipeCardProps } from "./types";
import {
  ICONS_PATH,
  RECIPE_ICON_IDS,
  DIFFICULTY_ICON,
  MAX_VISIBLE_TAGS,
} from "./utils";
import IconButton from "../icon-button/IconButton";
import Icon from "../icon/Icon";

import styles from "./RecipeCard.module.scss";

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
}: RecipeCardProps) => {
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
        </div>
      </div>

      <div className={styles["recipe-card__content"]}>
        <div className={styles["recipe-card__header"]}>
          <h3 className={styles["recipe-card__title"]}>{recipe.title}</h3>

          {canEdit && (
            <div className={styles["recipe-card__actions"]}>
              <IconButton
                variant="action"
                actionType="edit"
                iconSrc={`${ICONS_PATH}${RECIPE_ICON_IDS.edit}`}
                label="edit"
                onClick={handleEdit}
              />
              <IconButton
                variant="action"
                actionType="delete"
                iconSrc={`${ICONS_PATH}${RECIPE_ICON_IDS.delete}`}
                label="delete"
                onClick={handleDelete}
              />
            </div>
          )}
        </div>

        <p className={styles["recipe-card__description"]}>
          {recipe.description}
        </p>

        <div className={styles["recipe-card__meta"]}>
          <span className={styles["recipe-card__meta-item"]}>
            <Icon
              src={`${ICONS_PATH}${RECIPE_ICON_IDS.clock}`}
              size={16}
              className={styles["recipe-card__meta-icon"]}
            />
            {recipe.cookingTime} min
          </span>
          <span className={styles["recipe-card__meta-item"]}>
            <Icon
              src={`${ICONS_PATH}${DIFFICULTY_ICON[recipe.difficulty]}`}
              size={16}
              className={styles["recipe-card__meta-icon"]}
            />
            {recipe.difficulty}
          </span>
          <span className={styles["recipe-card__meta-item"]}>
            <Icon
              src={`${ICONS_PATH}${RECIPE_ICON_IDS.star}`}
              size={16}
              className={styles["recipe-card__meta-icon"]}
            />
            {recipe.rating.value.toFixed(1)}
          </span>
        </div>

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
