import { ICONS_PATH, RECIPE_ICON_IDS } from "../../common/recipe-card/utils";
import FilterGroup from "../filter-group/FilterGroup";
import CheckboxOption from "../checkbox-option/CheckboxOption";
import RangeFilter from "../../common/range-filter/RangeFilter";
import IngredientInput from "../../common/ingredient-input/IngredientInput";

import {
  COOKING_TIME,
  DIFFICULTY_OPTIONS,
  countByDiet,
  countByDifficulty,
  getDietOptions,
  getIngredientSuggestions,
} from "../../../pages/catalog-page/utils";
import type { Difficulty } from "../../../pages/catalog-page/types";
import { toggleValue } from "./utils";
import type { FilterPanelProps } from "./types";
import styles from "./FilterPanel.module.scss";

const FilterPanel = ({
  recipes,
  filters,
  onChange,
  onReset,
  isResettable,
}: FilterPanelProps) => {
  const dietOptions = getDietOptions(recipes);
  const ingredientSuggestions = getIngredientSuggestions(recipes);

  return (
    <aside className={styles["filter-panel"]}>
      <header className={styles["filter-panel__header"]}>
        <h2 className={styles["filter-panel__title"]}>Filters</h2>
        {isResettable && (
          <button
            type="button"
            className={styles["filter-panel__reset"]}
            onClick={onReset}>
            Clear all
          </button>
        )}
      </header>

      <div className={styles["filter-panel__scroll"]}>
        <FilterGroup
          title="Diet"
          iconSrc={`${ICONS_PATH}${RECIPE_ICON_IDS.salad}`}>
          {dietOptions.map((option) => (
            <CheckboxOption
              key={option.key}
              label={option.label}
              count={countByDiet(recipes, option.key)}
              checked={filters.diet.includes(option.key)}
              onToggle={() =>
                onChange({
                  ...filters,
                  diet: toggleValue(filters.diet, option.key),
                })
              }
            />
          ))}
        </FilterGroup>

        <FilterGroup
          title="Difficulty"
          iconSrc={`${ICONS_PATH}${RECIPE_ICON_IDS.medium}`}>
          {DIFFICULTY_OPTIONS.map((option) => (
            <CheckboxOption
              key={option.key}
              label={option.label}
              count={countByDifficulty(recipes, option.key as Difficulty)}
              checked={filters.difficulty.includes(option.key as Difficulty)}
              onToggle={() =>
                onChange({
                  ...filters,
                  difficulty: toggleValue(
                    filters.difficulty,
                    option.key as Difficulty
                  ),
                })
              }
            />
          ))}
        </FilterGroup>

        <FilterGroup
          title="Cooking time"
          iconSrc={`${ICONS_PATH}${RECIPE_ICON_IDS.clock}`}>
          <RangeFilter
            min={COOKING_TIME.min}
            max={COOKING_TIME.max}
            step={COOKING_TIME.step}
            value={filters.maxTime}
            unitLabel="min"
            onChange={(maxTime) => onChange({ ...filters, maxTime })}
          />
        </FilterGroup>

        <FilterGroup
          title="Ingredients"
          iconSrc={`${ICONS_PATH}${RECIPE_ICON_IDS.list}`}>
          <IngredientInput
            ingredients={filters.ingredients}
            suggestions={ingredientSuggestions}
            onAdd={(ingredient) =>
              onChange({
                ...filters,
                ingredients: toggleValue(
                  filters.ingredients,
                  ingredient,
                  "add"
                ),
              })
            }
            onRemove={(ingredient) =>
              onChange({
                ...filters,
                ingredients: filters.ingredients.filter(
                  (i) => i !== ingredient
                ),
              })
            }
          />
        </FilterGroup>
      </div>
    </aside>
  );
};

export default FilterPanel;
