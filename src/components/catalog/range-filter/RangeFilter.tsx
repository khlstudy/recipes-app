import type { ChangeEvent, CSSProperties } from "react";

import type { RangeFilterProps } from "./types";
import styles from "./RangeFilter.module.scss";

const RangeFilter = ({
  min,
  max,
  step,
  value,
  unitLabel,
  onChange,
}: RangeFilterProps) => {
  const percent = ((value - min) / (max - min)) * 100;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className={styles["range-filter"]}>
      <output className={styles["range-filter__value"]}>
        Up to <strong>{value}</strong> {unitLabel}
      </output>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className={styles["range-filter__input"]}
        style={{ "--percent": `${percent}%` } as CSSProperties}
        aria-label={`Maximum ${unitLabel}`}
      />

      <div className={styles["range-filter__scale"]}>
        <span>
          {min} {unitLabel}
        </span>
        <span>
          {max} {unitLabel}
        </span>
      </div>
    </div>
  );
};

export default RangeFilter;
