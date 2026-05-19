import Icon from "../../common/icon/Icon";
import { CELL_VARIANTS, iconSrc } from "../recipe-comparison-table/utils";
import type { RecipeTableCellProps } from "./types";
import styles from "../recipe-comparison-table/RecipeComparison.module.scss";

const RecipeTableCell = ({
  value,
  unit,
  iconId,
  variant,
  type = "cell",
}: RecipeTableCellProps) => {
  const wrapperClass =
    type === "headerCell"
      ? styles["recipe-comparison__header-cell"]
      : type === "mobileValue"
        ? styles["recipe-comparison__mobile-value"]
        : styles["recipe-comparison__cell"];

  if (variant === CELL_VARIANTS.difficultyPill) {
    return (
      <div className={wrapperClass}>
        <span
          className={`${styles["recipe-comparison__difficulty"]} ${styles[`recipe-comparison__difficulty--${value}`]}`}>
          {value}
        </span>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      {iconId && (
        <Icon
          src={iconSrc(iconId)}
          size={14}
          className={styles["recipe-comparison__meta-icon"]}
        />
      )}
      {value}
      {unit && (
        <span className={styles["recipe-comparison__unit"]}>{unit}</span>
      )}
    </div>
  );
};

export default RecipeTableCell;
