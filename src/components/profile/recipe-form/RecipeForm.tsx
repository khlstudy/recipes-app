import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type SubmitEvent,
} from "react";

import { useToastContext } from "../../../context/ToastContext";
import Input from "../../common/input/Input";
import Button from "../../common/button/Button";
import ChipGroup from "../../common/chip-group/ChipGroup";

import BasicInfoSection from "./basic-info-section/BasicInfoSection";
import IngredientRow from "./ingredient-row/IngredientRow";
import StepRow from "./step-row/StepRow";
import SectionHeader from "./section-header/SectionHeader";

import { type StepKey } from "./types";
import type {
  IngredientDraft,
  RecipeFormProps,
  RecipeFormState,
} from "./types";

import {
  EMPTY_RECIPE_FORM,
  NUTRITION_FIELDS,
  buildRecipeRequest,
  limitNumericLength,
  matchIngredientSuggestions,
  matchUnitSuggestions,
  validateRecipeForm,
  ingredientFullyFilled,
  ingredientFullyEmpty,
  stepStatus,
  buildSectionComplete,
  buildSectionStarted,
  getFilledCounts,
  updateFieldInForm,
  updateIngredientInForm,
  updateStepInForm,
  addIngredientToForm,
  removeIngredientFromForm,
  addStepToForm,
  removeStepFromForm,
  addChipToForm,
  removeChipFromForm,
} from "./utils";
import { POPULAR_PICKS_LIMIT } from "../../../pages/profile-page/utils";
import { classNames } from "../../../utils/classNames";

import styles from "./RecipeForm.module.scss";

const RecipeForm = ({
  submitting,
  tagPool,
  dietPool,
  ingredientPool,
  unitPool,
  onSubmit,
  initialState,
  mode = "create",
  submitLabel,
  submittingLabel,
}: RecipeFormProps) => {
  const { showToast } = useToastContext();
  const [form, setForm] = useState<RecipeFormState>(
    initialState ?? EMPTY_RECIPE_FORM
  );

  useEffect(() => {
    setForm(initialState ?? EMPTY_RECIPE_FORM);
  }, [initialState]);
  const [focusedStep, setFocusedStep] = useState<StepKey | null>(null);
  const [activeIngredientId, setActiveIngredientId] = useState<string | null>(
    null
  );
  const [activeUnitId, setActiveUnitId] = useState<string | null>(null);

  const ingredientNames = form.ingredients.map((ing) => ing.name);

  const hasFullIngredient = form.ingredients.some(ingredientFullyFilled);
  const hasPartialIngredient = form.ingredients.some(
    (ing) => !ingredientFullyFilled(ing) && !ingredientFullyEmpty(ing)
  );

  const sectionComplete = buildSectionComplete(
    form,
    hasFullIngredient,
    hasPartialIngredient
  );
  const sectionStarted = buildSectionStarted(form);
  const { filledIngredientCount, filledStepCount } = getFilledCounts(form);

  const stepClass = (key: StepKey) =>
    classNames(
      styles["recipe-form__step"],
      focusedStep === key && styles["recipe-form__step--focused"]
    );

  const headerStatus = (key: StepKey) =>
    stepStatus(
      key,
      sectionStarted,
      focusedStep,
      sectionComplete[key],
      filledIngredientCount,
      filledStepCount,
      form.tags.length,
      form.diet.length
    );

  const sectionRefs = useRef<Record<StepKey, HTMLElement | null>>({
    basic: null,
    ingredients: null,
    steps: null,
    nutrition: null,
    tags: null,
    diet: null,
  });

  const sectionProps = (key: StepKey) => ({
    ref: (node: HTMLElement | null) => {
      sectionRefs.current[key] = node;
    },
    className: stepClass(key),
    onFocus: () => setFocusedStep(key),
    onBlur: (event: FocusEvent<HTMLElement>) => {
      const next = event.relatedTarget as Node | null;
      if (!next || !event.currentTarget.contains(next)) {
        setFocusedStep((current) => (current === key ? null : current));
      }
    },
  });

  const focusFirstField = (key: StepKey) => {
    const root = sectionRefs.current[key];
    if (!root) return;
    const target = root.querySelector<HTMLElement>(
      "input:not([type='hidden']), textarea, select, button:not([type='submit'])"
    );
    target?.focus();
  };

  const setField = <K extends keyof RecipeFormState>(
    key: K,
    value: RecipeFormState[K]
  ) => setForm((prev) => updateFieldInForm(prev, key, value));

  const updateIngredient = (
    id: string,
    key: keyof Omit<IngredientDraft, "id">,
    value: string
  ) => setForm((prev) => updateIngredientInForm(prev, id, key, value));

  const updateStep = (id: string, value: string) =>
    setForm((prev) => updateStepInForm(prev, id, value));

  const addIngredient = () => setForm((prev) => addIngredientToForm(prev));

  const removeIngredient = (id: string) =>
    setForm((prev) => removeIngredientFromForm(prev, id));

  const addStep = () => setForm((prev) => addStepToForm(prev));

  const removeStep = (id: string) =>
    setForm((prev) => removeStepFromForm(prev, id));

  const addChip = (key: "tags" | "diet", value: string) => {
    setForm((prev) => {
      const updated = addChipToForm(prev, key, value);
      return updated ?? prev;
    });
  };

  const removeChip = (key: "tags" | "diet", value: string) =>
    setForm((prev) => removeChipFromForm(prev, key, value));

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateRecipeForm(form);
    if (validationError) {
      showToast({
        tone: "error",
        title: "Please complete the form",
        description: validationError,
      });
      return;
    }
    onSubmit(buildRecipeRequest(form));
    if (mode === "create") setForm(EMPTY_RECIPE_FORM);
  };

  const resolvedSubmitLabel =
    submitLabel ?? (mode === "edit" ? "Save changes" : "Create recipe");
  const resolvedSubmittingLabel =
    submittingLabel ?? (mode === "edit" ? "Saving..." : "Publishing...");

  return (
    <form className={styles["recipe-form"]} onSubmit={handleSubmit} noValidate>
      <section {...sectionProps("basic")}>
        <SectionHeader
          number={1}
          title="Basic information"
          status={headerStatus("basic")}
          onLegendClick={() => focusFirstField("basic")}
        />
        <BasicInfoSection form={form} onFieldChange={setField} />
      </section>

      <section {...sectionProps("ingredients")}>
        <SectionHeader
          number={2}
          title="Ingredients"
          status={headerStatus("ingredients")}
          onLegendClick={() => focusFirstField("ingredients")}
        />
        <ul className={styles["recipe-form__rows"]}>
          {form.ingredients.map((ingredient, index) => {
            const nameSuggestions = matchIngredientSuggestions(
              ingredientPool,
              ingredientNames,
              ingredient.name
            );
            const unitSuggestions =
              activeUnitId === ingredient.id
                ? matchUnitSuggestions(unitPool, ingredient.unit)
                : [];
            return (
              <IngredientRow
                key={ingredient.id}
                ingredient={ingredient}
                index={index}
                isLastRemaining={form.ingredients.length === 1}
                nameSuggestions={nameSuggestions}
                unitSuggestions={unitSuggestions}
                isActiveName={activeIngredientId === ingredient.id}
                isActiveUnit={activeUnitId === ingredient.id}
                onActivateName={() => setActiveIngredientId(ingredient.id)}
                onDeactivateName={() =>
                  setActiveIngredientId((current) =>
                    current === ingredient.id ? null : current
                  )
                }
                onActivateUnit={() => setActiveUnitId(ingredient.id)}
                onDeactivateUnit={() =>
                  setActiveUnitId((current) =>
                    current === ingredient.id ? null : current
                  )
                }
                onChange={(key, value) =>
                  updateIngredient(ingredient.id, key, value)
                }
                onSelectSuggestion={(key, value) => {
                  updateIngredient(ingredient.id, key, value);
                  if (key === "name") setActiveIngredientId(null);
                  else setActiveUnitId(null);
                }}
                onRemove={() => removeIngredient(ingredient.id)}
              />
            );
          })}
        </ul>
        <Button
          type="button"
          variant="secondary-outline"
          size="small"
          onClick={addIngredient}>
          Add ingredient
        </Button>
      </section>

      <section {...sectionProps("steps")}>
        <SectionHeader
          number={3}
          title="Cooking steps"
          status={headerStatus("steps")}
          onLegendClick={() => focusFirstField("steps")}
        />
        <ol className={styles["recipe-form__rows"]}>
          {form.steps.map((step, index) => (
            <StepRow
              key={step.id}
              step={step}
              index={index}
              isLastRemaining={form.steps.length === 1}
              onChange={(value) => updateStep(step.id, value)}
              onRemove={() => removeStep(step.id)}
            />
          ))}
        </ol>
        <Button
          type="button"
          variant="secondary-outline"
          size="small"
          onClick={addStep}>
          Add step
        </Button>
      </section>

      <section {...sectionProps("nutrition")}>
        <SectionHeader
          number={4}
          title="Nutritional value (per serving)"
          status={headerStatus("nutrition")}
          onLegendClick={() => focusFirstField("nutrition")}
        />
        <div className={styles["recipe-form__nutrition"]}>
          {NUTRITION_FIELDS.map((field) => (
            <Input
              key={field.key}
              name={field.key}
              type="text"
              inputMode="numeric"
              maxLength={field.maxLength}
              label={field.label}
              placeholder="0"
              caption={`In ${field.unit}`}
              value={form[field.key]}
              surface="raised"
              onChange={(event) =>
                setField(
                  field.key,
                  limitNumericLength(event.target.value, field.maxLength)
                )
              }
            />
          ))}
        </div>
      </section>

      <section {...sectionProps("tags")}>
        <SectionHeader
          number={5}
          title="Tags"
          status={headerStatus("tags")}
          onLegendClick={() => focusFirstField("tags")}
        />
        <ChipGroup
          values={form.tags}
          suggestions={tagPool}
          quickPicks={tagPool.slice(0, POPULAR_PICKS_LIMIT)}
          placeholder="e.g. dinner, italian, quick"
          emptyLabel="No tags added yet."
          suggestionsMaxVisible={2}
          onAdd={(value) => addChip("tags", value)}
          onRemove={(value) => removeChip("tags", value)}
        />
      </section>

      <section {...sectionProps("diet")}>
        <SectionHeader
          number={6}
          title="Diet"
          required={false}
          status={headerStatus("diet")}
          onLegendClick={() => focusFirstField("diet")}
        />
        <ChipGroup
          values={form.diet}
          suggestions={dietPool}
          quickPicks={dietPool.slice(0, POPULAR_PICKS_LIMIT)}
          placeholder="e.g. vegetarian, vegan, gluten-free"
          emptyLabel="No diets added yet."
          suggestionsMaxVisible={2}
          onAdd={(value) => addChip("diet", value)}
          onRemove={(value) => removeChip("diet", value)}
        />
      </section>

      <div className={styles["recipe-form__actions"]}>
        <Button
          type="submit"
          variant="secondary"
          size="large"
          disabled={submitting}>
          {submitting ? resolvedSubmittingLabel : resolvedSubmitLabel}
        </Button>
      </div>
    </form>
  );
};

export default RecipeForm;
