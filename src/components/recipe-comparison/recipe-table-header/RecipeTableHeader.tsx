import { classNames } from "../../../utils/classNames";
import type { RecipeTableHeaderProps } from "./types";
import styles from "./RecipeTableHeader.module.scss";

const RecipeTableHeader = ({
  recipe,
  onRemove,
  className,
  mobile,
}: RecipeTableHeaderProps) => (
  <div
    className={classNames(
      styles["recipe-table-header"],
      mobile ? styles["recipe-table-header--mobile"] : null,
      className
    )}>
    <img
      src={recipe.imageUrl}
      alt={recipe.title}
      className={styles["recipe-table-header__image"]}
    />
    <h3 className={styles["recipe-table-header__title"]}>{recipe.title}</h3>
    <button
      type="button"
      className={styles["recipe-table-header__remove"]}
      onClick={() => onRemove(recipe.id)}
      aria-label={`Remove ${recipe.title}`}>
      ×
    </button>
  </div>
);

export default RecipeTableHeader;
