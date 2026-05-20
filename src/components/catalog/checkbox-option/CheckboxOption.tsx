import type { CheckboxOptionProps } from "./types";
import styles from "./CheckboxOption.module.scss";

const CheckboxOption = ({
  label,
  checked,
  count,
  onToggle,
}: CheckboxOptionProps) => (
  <label className={styles["checkbox-option"]}>
    <input
      type="checkbox"
      checked={checked}
      onChange={onToggle}
      className={styles["checkbox-option__input"]}
    />
    <span className={styles["checkbox-option__box"]} aria-hidden="true" />
    <span className={styles["checkbox-option__label"]}>{label}</span>
    {count !== undefined && (
      <span className={styles["checkbox-option__count"]}>{count}</span>
    )}
  </label>
);

export default CheckboxOption;
