import { useState } from "react";

import { classNames } from "../../../utils/classNames";
import { SCALE_OPTIONS, formatAmount } from "./utils";
import type { IngredientListProps, ScaleValue } from "./types";
import styles from "./IngredientList.module.scss";

const IngredientList = ({ ingredients }: IngredientListProps) => {
  const [scale, setScale] = useState<ScaleValue>(1);

  return (
    <div className={styles["ingredient-list"]}>
      <div
        className={styles["ingredient-list__scale"]}
        role="radiogroup"
        aria-label="Serving scale">
        <span className={styles["ingredient-list__scale-label"]}>
          Scale servings:
        </span>
        <div className={styles["ingredient-list__scale-options"]}>
          {SCALE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              role="radio"
              aria-checked={scale === opt.value}
              className={classNames(
                styles["ingredient-list__scale-btn"],
                scale === opt.value
                  ? styles["ingredient-list__scale-btn--active"]
                  : null
              )}
              onClick={() => setScale(opt.value)}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <ul className={styles["ingredient-list__items"]}>
        {ingredients.map((ing) => (
          <li key={ing.name} className={styles["ingredient-list__item"]}>
            <span className={styles["ingredient-list__name"]}>{ing.name}</span>
            <span className={styles["ingredient-list__amount"]}>
              {formatAmount(ing.amount, scale)} {ing.unit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientList;
