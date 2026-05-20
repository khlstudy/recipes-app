import IngredientInput from "../../common/ingredient-input/IngredientInput";
import SectionHeading from "../../common/section-heading/SectionHeading";
import { ICONS_PATH, RECIPE_ICON_IDS } from "../../common/recipe-card/utils";
import type { PantryInputProps } from "./types";
import styles from "./PantryInput.module.scss";

const PantryInput = ({
  ingredients,
  suggestions,
  onAdd,
  onRemove,
  onClear,
}: PantryInputProps) => (
  <section className={styles["pantry-input"]}>
    <header className={styles["pantry-input__header"]}>
      <SectionHeading
        title="What's in your kitchen?"
        iconSrc={`${ICONS_PATH}${RECIPE_ICON_IDS.list}`}
        size="lg"
        as="h2"
      />
      {ingredients.length > 0 && (
        <button
          type="button"
          className={styles["pantry-input__clear"]}
          onClick={onClear}>
          Clear all
        </button>
      )}
    </header>

    <p className={styles["pantry-input__hint"]}>
      Add the ingredients you already have. We will rank recipes by how much of
      each one you can make right now.
    </p>

    <IngredientInput
      ingredients={ingredients}
      suggestions={suggestions}
      onAdd={onAdd}
      onRemove={onRemove}
      placeholder="e.g. eggs, tomato, olive oil"
    />
  </section>
);

export default PantryInput;
