import RecipeTableHeader from "../recipe-table-header/RecipeTableHeader";
import RecipeTableCell from "../recipe-table-cell/RecipeTableCell";
import { classNames } from "../../../utils/classNames";

import type { RecipeComparisonProps } from "./types";
import { ROWS } from "./utils";

import styles from "./RecipeComparison.module.scss";

const RecipeComparisonTable = ({
  recipes,
  onRemove,
}: RecipeComparisonProps) => {
  if (recipes.length === 0) {
    return (
      <div className={styles["recipe-comparison__empty"]}>
        <p>
          Add recipes using the scales button on recipe cards to compare them.
        </p>
      </div>
    );
  }

  return (
    <div className={styles["recipe-comparison"]}>
      <div className={styles["recipe-comparison__table"]}>
        <div className={styles["recipe-comparison__col"]} aria-hidden="true">
          <RecipeTableCell type="headerCell" value="Criteria" />
          {ROWS.map((row) => (
            <RecipeTableCell key={row.key} value={row.text} />
          ))}
        </div>

        {recipes.map((recipe) => (
          <div key={recipe.id} className={styles["recipe-comparison__col"]}>
            <RecipeTableHeader
              recipe={recipe}
              onRemove={onRemove}
              className={styles["recipe-comparison__header-cell"]}
            />
            {ROWS.map((row) => (
              <RecipeTableCell
                key={row.key}
                {...row.getCellData(recipe)}
                iconId={row.iconId}
                variant={row.variant}
              />
            ))}
          </div>
        ))}
      </div>

      <div className={styles["recipe-comparison__mobile"]}>
        <div className={styles["recipe-comparison__mobile-headers"]}>
          {recipes.map((recipe) => (
            <RecipeTableHeader
              key={recipe.id}
              recipe={recipe}
              onRemove={onRemove}
              className={styles["recipe-comparison__mobile-header"]}
              mobile
            />
          ))}
        </div>

        {ROWS.map((row) => (
          <div
            key={row.key}
            className={styles["recipe-comparison__mobile-row"]}>
            <div className={styles["recipe-comparison__mobile-label"]}>
              {row.text}
            </div>
            <div
              className={classNames(
                styles["recipe-comparison__mobile-values"],
                row.alt && styles["recipe-comparison__mobile-values--alt"]
              )}>
              {recipes.map((recipe) => (
                <RecipeTableCell
                  key={recipe.id}
                  type="mobileValue"
                  {...row.getCellData(recipe)}
                  variant={row.variant}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeComparisonTable;
