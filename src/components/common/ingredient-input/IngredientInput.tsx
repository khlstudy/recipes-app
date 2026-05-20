import { useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";

import IconButton from "../icon-button/IconButton";
import SuggestionList from "../suggestion-list/SuggestionList";
import { ICONS_PATH, RECIPE_ICON_IDS } from "../recipe-card/utils";
import { matchSuggestions } from "./utils";
import type { IngredientInputProps } from "./types";
import styles from "./IngredientInput.module.scss";

const IngredientInput = ({
  ingredients,
  suggestions,
  onAdd,
  onRemove,
  placeholder = "Add an ingredient",
}: IngredientInputProps) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const matches = matchSuggestions(suggestions, ingredients, query);

  const handleAdd = (ingredient: string) => {
    const value = ingredient.trim();
    if (!value) return;
    onAdd(value);
    setQuery("");
    inputRef.current?.focus();
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
    <div className={styles["ingredient-input"]}>
      <div className={styles["ingredient-input__field"]}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={styles["ingredient-input__input"]}
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
        <ul className={styles["ingredient-input__tags"]}>
          {ingredients.map((ingredient) => (
            <li key={ingredient}>
              <button
                type="button"
                className={styles["ingredient-input__tag"]}
                onClick={() => onRemove(ingredient)}>
                {ingredient}
                <span
                  className={styles["ingredient-input__tag-remove"]}
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

export default IngredientInput;
