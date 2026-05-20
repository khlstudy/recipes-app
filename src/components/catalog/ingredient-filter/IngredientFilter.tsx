import { useState, type ChangeEvent, type KeyboardEvent } from "react";

import IconButton from "../../common/icon-button/IconButton";
import SuggestionList from "../../common/suggestion-list/SuggestionList";
import { ICONS_PATH, RECIPE_ICON_IDS } from "../../common/recipe-card/utils";
import { matchSuggestions } from "./utils";
import type { IngredientFilterProps } from "./types";
import styles from "./IngredientFilter.module.scss";

const IngredientFilter = ({
  ingredients,
  suggestions,
  onAdd,
  onRemove,
}: IngredientFilterProps) => {
  const [query, setQuery] = useState("");

  const matches = matchSuggestions(suggestions, ingredients, query);

  const handleAdd = (ingredient: string) => {
    const value = ingredient.trim();
    if (!value) return;
    onAdd(value);
    setQuery("");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd(matches[0] ?? query);
    }
  };

  return (
    <div className={styles["ingredient-filter"]}>
      <div className={styles["ingredient-filter__field"]}>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Add an ingredient"
          className={styles["ingredient-filter__input"]}
          autoComplete="off"
        />
        <IconButton
          variant="action"
          iconSrc={`${ICONS_PATH}${RECIPE_ICON_IDS.add}`}
          label="add ingredient"
          onClick={() => handleAdd(matches[0] ?? query)}
        />
      </div>

      <SuggestionList suggestions={matches} onSelect={handleAdd} />

      {ingredients.length > 0 && (
        <ul className={styles["ingredient-filter__tags"]}>
          {ingredients.map((ingredient) => (
            <li key={ingredient}>
              <button
                type="button"
                className={styles["ingredient-filter__tag"]}
                onClick={() => onRemove(ingredient)}>
                {ingredient}
                <span
                  className={styles["ingredient-filter__tag-remove"]}
                  aria-hidden="true">
                  ×
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default IngredientFilter;
