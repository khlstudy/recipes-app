import { classNames } from "../../../utils/classNames";
import type { InputProps } from "./types";

import styles from "./Input.module.scss";

const Input = ({
  name,
  label,
  caption,
  error,
  tone = "default",
  surface = "muted",
  requiredMark = false,
  ...restProps
}: InputProps) => {
  const captionId = `${name}-caption`;
  const hasError = Boolean(error);

  return (
    <div
      className={classNames(
        styles.input,
        styles[`input--${tone}`],
        styles[`input--surface-${surface}`]
      )}>
      <label className={styles.input__label} htmlFor={name}>
        {label}
        {requiredMark && (
          <span className={styles.input__required} aria-hidden="true">
            *
          </span>
        )}
      </label>

      <input
        id={name}
        name={name}
        className={styles.input__field}
        aria-invalid={hasError}
        aria-describedby={caption || error ? captionId : undefined}
        {...restProps}
      />

      {hasError ? (
        <p id={captionId} className={styles.input__error} role="alert">
          {error}
        </p>
      ) : (
        caption && (
          <p id={captionId} className={styles.input__caption}>
            {caption}
          </p>
        )
      )}
    </div>
  );
};

export default Input;
