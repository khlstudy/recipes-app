import Icon from "../../common/icon/Icon";
import Button from "../../common/button/Button";
import { ICONS_PATH, RECIPE_ICON_IDS } from "../../common/recipe-card/utils";
import { META_ITEMS, resolveIconId } from "./utils";
import type { RecipeHeroProps } from "./types";
import styles from "./RecipeHero.module.scss";

const RecipeHero = ({
  recipe,
  isFavorite,
  onFavoriteToggle,
  onBack,
}: RecipeHeroProps) => (
  <article className={styles["recipe-hero"]}>
    <div className={styles["recipe-hero__image-wrapper"]}>
      <img
        src={recipe.imageUrl}
        alt={recipe.title}
        className={styles["recipe-hero__image"]}
      />
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className={styles["recipe-hero__back"]}
          aria-label="Go back">
          <span
            className={styles["recipe-hero__back-arrow"]}
            aria-hidden="true">
            ←
          </span>
          Back
        </button>
      )}
      <div className={styles["recipe-hero__overlay"]}>
        <h1 className={styles["recipe-hero__title"]}>{recipe.title}</h1>
        <p className={styles["recipe-hero__description"]}>
          {recipe.description}
        </p>
      </div>
    </div>

    <div className={styles["recipe-hero__content"]}>
      <ul className={styles["recipe-hero__meta"]}>
        {META_ITEMS.map((item) => (
          <li key={item.key} className={styles["recipe-hero__meta-item"]}>
            <Icon
              src={`${ICONS_PATH}${resolveIconId(item.iconId, recipe.difficulty)}`}
              size={18}
              className={styles["recipe-hero__meta-icon"]}
            />
            <span className={styles["recipe-hero__meta-text"]}>
              {item.getValue(recipe)}
            </span>
          </li>
        ))}
      </ul>

      <Button
        variant={isFavorite ? "danger" : "primary"}
        size="medium"
        width="260px"
        onClick={() => onFavoriteToggle(recipe.id)}>
        <Icon
          src={`${ICONS_PATH}${isFavorite ? RECIPE_ICON_IDS.whiteHeart : RECIPE_ICON_IDS.whiteHeartNeutral}`}
          size={18}
          className={styles["recipe-hero__fav-icon"]}
        />
        {isFavorite ? "Remove from favorites" : "Add to favorites"}
      </Button>

      {recipe.tags.length > 0 && (
        <ul className={styles["recipe-hero__tags"]}>
          {recipe.tags.map((tag) => (
            <li key={tag} className={styles["recipe-hero__tag"]}>
              <span className={styles["recipe-hero__tag-hash"]}>#</span>
              {tag}
            </li>
          ))}
        </ul>
      )}
    </div>
  </article>
);

export default RecipeHero;
