import Input from "../../../common/input/Input";
import Button from "../../../common/button/Button";

import { DIFFICULTY_OPTIONS } from "../types";
import type { DifficultyOption } from "../types";
import type { BasicInfoSectionProps } from "./types";

import { BASIC_FIELDS, NUMBER_FIELDS, limitNumericLength } from "../utils";
import { classNames } from "../../../../utils/classNames";

import styles from "../RecipeForm.module.scss";

const BasicInfoSection = ({ form, onFieldChange }: BasicInfoSectionProps) => (
  <div className={styles["recipe-form__grid"]}>
    {BASIC_FIELDS.map((field) =>
      field.multiline ? (
        <label
          key={field.key}
          className={styles["recipe-form__textarea-field"]}>
          <span className={styles["recipe-form__label"]}>{field.label}</span>
          <span className={styles["recipe-form__textarea-wrap"]}>
            <textarea
              className={classNames(
                styles["recipe-form__textarea"],
                styles["recipe-form__textarea--fixed"]
              )}
              value={form[field.key]}
              placeholder={field.placeholder}
              rows={3}
              minLength={field.minLength}
              maxLength={field.maxLength}
              onChange={(event) => onFieldChange(field.key, event.target.value)}
            />
            {field.maxLength && (
              <span className={styles["recipe-form__counter"]}>
                {form[field.key].length}/{field.maxLength}
              </span>
            )}
          </span>
          <span className={styles["recipe-form__caption"]}>
            {field.caption}
          </span>
        </label>
      ) : (
        <Input
          key={field.key}
          name={field.key}
          label={field.label}
          placeholder={field.placeholder}
          caption={field.caption}
          value={form[field.key]}
          minLength={field.minLength}
          maxLength={field.maxLength}
          surface="raised"
          onChange={(event) => onFieldChange(field.key, event.target.value)}
        />
      )
    )}

    {NUMBER_FIELDS.map((field) => (
      <Input
        key={field.key}
        name={field.key}
        type="text"
        inputMode="numeric"
        maxLength={field.maxLength}
        label={field.label}
        placeholder={field.placeholder}
        caption={`In ${field.unit}`}
        value={form[field.key]}
        surface="raised"
        onChange={(event) =>
          onFieldChange(
            field.key,
            limitNumericLength(event.target.value, field.maxLength)
          )
        }
      />
    ))}

    <div className={styles["recipe-form__difficulty"]}>
      <span className={styles["recipe-form__label"]}>Difficulty</span>
      <div className={styles["recipe-form__difficulty-options"]}>
        {DIFFICULTY_OPTIONS.map((option) => {
          const isActive = form.difficulty === option;
          return (
            <Button
              key={option}
              type="button"
              variant="field"
              size="small"
              aria-pressed={isActive}
              onClick={() =>
                onFieldChange(
                  "difficulty",
                  isActive ? null : (option as DifficultyOption)
                )
              }>
              {option}
            </Button>
          );
        })}
      </div>
    </div>
  </div>
);

export default BasicInfoSection;
