import { useEffect, useState, type SubmitEvent } from "react";

import { classNames } from "../../../utils/classNames";
import Button from "../../common/button/Button";
import Input from "../../common/input/Input";
import { useFieldValidation } from "../../../hooks/useFieldValidation";
import { createProfileValidationRules } from "../../../utils/validation/profileRules";
import type { IdentityCardProps, IdentityFormValues } from "./types";
import { IDENTITY_FIELDS, ROLE_LABEL, getInitials } from "./utils";

import styles from "./IdentityCard.module.scss";

const RULES = createProfileValidationRules();

const IdentityCard = ({
  profile,
  role,
  saving,
  serverError,
  onLogout,
  onSave,
}: IdentityCardProps) => {
  const [values, setValues] = useState<IdentityFormValues>({
    name: profile.name,
    email: profile.email,
  });
  const { errors, validateFields, validateSingleField } =
    useFieldValidation(RULES);

  useEffect(() => {
    setValues({ name: profile.name, email: profile.email });
  }, [profile.name, profile.email]);

  const isDirty =
    values.name.trim() !== profile.name ||
    values.email.trim() !== profile.email;

  const handleChange = (field: keyof IdentityFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) validateSingleField(field, value, values);
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateFields(values)) return;
    await onSave({
      name: values.name.trim(),
      email: values.email.trim(),
    });
  };

  return (
    <article className={styles["identity-card"]}>
      <header className={styles["identity-card__top"]}>
        <div className={styles["identity-card__avatar"]} aria-hidden="true">
          {getInitials(profile.name)}
        </div>
        <div className={styles["identity-card__identity"]}>
          <h3 className={styles["identity-card__name"]}>{profile.name}</h3>
          <span
            className={classNames(
              styles["identity-card__role"],
              styles[`identity-card__role--${role}`]
            )}>
            {ROLE_LABEL[role]}
          </span>
        </div>
        <div className={styles["identity-card__logout"]}>
          <Button
            variant="danger"
            size="small"
            type="button"
            onClick={onLogout}>
            Log out
          </Button>
        </div>
      </header>

      <form
        className={styles["identity-card__form"]}
        onSubmit={handleSubmit}
        noValidate>
        {IDENTITY_FIELDS.map((field) => (
          <Input
            key={field.key}
            name={field.key}
            type={field.type}
            label={field.label}
            placeholder={field.placeholder}
            caption={field.caption}
            autoComplete={field.autoComplete}
            value={values[field.key]}
            error={errors[field.key]}
            onChange={(event) => handleChange(field.key, event.target.value)}
            onBlur={() =>
              validateSingleField(field.key, values[field.key], values)
            }
          />
        ))}

        {serverError && (
          <p className={styles["identity-card__error"]} role="alert">
            {serverError}
          </p>
        )}

        <div className={styles["identity-card__actions"]}>
          <Button
            type="submit"
            variant="secondary"
            size="small"
            disabled={saving || !isDirty}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </article>
  );
};

export default IdentityCard;
