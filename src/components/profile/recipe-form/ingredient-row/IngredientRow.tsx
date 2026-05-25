import SuggestionList from "../../../common/suggestion-list/SuggestionList";

import {
  INGREDIENT_AMOUNT_MAX_LENGTH,
  INGREDIENT_NAME_MAX_LENGTH,
  INGREDIENT_UNIT_MAX_LENGTH,
} from "../types";
import type { IngredientRowProps } from "./types";

import { limitNumericLength } from "../utils";

import styles from "../RecipeForm.module.scss";

const IngredientRow = ({
  ingredient,
  index,
  isLastRemaining,
  nameSuggestions,
  unitSuggestions,
  isActiveName,
  isActiveUnit,
  onActivateName,
  onDeactivateName,
  onActivateUnit,
  onDeactivateUnit,
  onChange,
  onSelectSuggestion,
  onRemove,
}: IngredientRowProps) => {
  const showNameSuggestions = isActiveName && nameSuggestions.length > 0;
  const showUnitSuggestions = isActiveUnit && unitSuggestions.length > 0;

  return (
    <li className={styles["recipe-form__row"]}>
      <div className={styles["recipe-form__row-name"]}>
        <input
          type="text"
          className={styles["recipe-form__row-input"]}
          value={ingredient.name}
          placeholder="Ingredient name"
          minLength={1}
          maxLength={INGREDIENT_NAME_MAX_LENGTH}
          aria-label={`Ingredient ${index + 1} name`}
          autoComplete="off"
          onFocus={onActivateName}
          onBlur={onDeactivateName}
          onChange={(event) => onChange("name", event.target.value)}
        />
        {showNameSuggestions && (
          <div className={styles["recipe-form__row-suggestions"]}>
            <SuggestionList
              suggestions={nameSuggestions}
              maxVisible={2}
              onSelect={(value) => onSelectSuggestion("name", value)}
            />
          </div>
        )}
      </div>
      <input
        type="text"
        inputMode="numeric"
        maxLength={INGREDIENT_AMOUNT_MAX_LENGTH}
        className={styles["recipe-form__row-amount"]}
        value={ingredient.amount}
        placeholder="Qty"
        aria-label={`Ingredient ${index + 1} quantity`}
        onChange={(event) =>
          onChange(
            "amount",
            limitNumericLength(event.target.value, INGREDIENT_AMOUNT_MAX_LENGTH)
          )
        }
      />
      <div className={styles["recipe-form__row-unit-wrap"]}>
        <input
          type="text"
          className={styles["recipe-form__row-unit"]}
          value={ingredient.unit}
          placeholder="Unit"
          minLength={1}
          maxLength={INGREDIENT_UNIT_MAX_LENGTH}
          aria-label={`Ingredient ${index + 1} unit`}
          autoComplete="off"
          onFocus={onActivateUnit}
          onBlur={onDeactivateUnit}
          onChange={(event) => onChange("unit", event.target.value)}
        />
        {showUnitSuggestions && (
          <div className={styles["recipe-form__row-suggestions"]}>
            <SuggestionList
              suggestions={unitSuggestions}
              maxVisible={2}
              onSelect={(value) => onSelectSuggestion("unit", value)}
            />
          </div>
        )}
      </div>
      <button
        type="button"
        className={styles["recipe-form__row-remove"]}
        onClick={onRemove}
        aria-label={isLastRemaining ? "Clear ingredient" : "Remove ingredient"}>
        ×
      </button>
    </li>
  );
};

export default IngredientRow;
