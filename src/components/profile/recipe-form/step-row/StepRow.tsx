import { STEP_MAX_LENGTH } from "../types";
import type { StepRowProps } from "./types";

import { classNames } from "../../../../utils/classNames";

import styles from "../RecipeForm.module.scss";

const StepRow = ({
  step,
  index,
  isLastRemaining,
  onChange,
  onRemove,
}: StepRowProps) => (
  <li className={styles["recipe-form__step-row"]}>
    <span className={styles["recipe-form__step-order"]}>{index + 1}</span>
    <span className={styles["recipe-form__textarea-wrap"]}>
      <textarea
        className={classNames(
          styles["recipe-form__step-input"],
          styles["recipe-form__step-input--fixed"]
        )}
        value={step.text}
        placeholder="Describe this step"
        rows={2}
        minLength={1}
        maxLength={STEP_MAX_LENGTH}
        aria-label={`Step ${index + 1}`}
        onChange={(event) => onChange(event.target.value)}
      />
      <span className={styles["recipe-form__counter"]}>
        {step.text.length}/{STEP_MAX_LENGTH}
      </span>
    </span>
    <button
      type="button"
      className={styles["recipe-form__row-remove"]}
      onClick={onRemove}
      aria-label={isLastRemaining ? "Clear step" : "Remove step"}>
      ×
    </button>
  </li>
);

export default StepRow;
