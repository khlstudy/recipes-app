import type { InputProps } from "./types";

import styles from "./Input.module.scss";

const Input = ({ name, label, caption, error, ...restProps }: InputProps) => {
  const captionId = `${name}-caption`;
  const hasError = Boolean(error);

  return (
    <div className={styles.input}>
      <label className={styles.input__label} htmlFor={name}>
        {label}
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
