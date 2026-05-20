import type { CSSProperties } from "react";

import type { ProgressBarProps } from "./types";
import styles from "./ProgressBar.module.scss";

const ProgressBar = ({ value, label, ariaLabel }: ProgressBarProps) => {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div className={styles["progress-bar"]}>
      {label && (
        <div className={styles["progress-bar__label"]}>
          <span>{label}</span>
          <strong>{clamped}%</strong>
        </div>
      )}

      <div
        className={styles["progress-bar__track"]}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel ?? label}>
        <div
          className={styles["progress-bar__fill"]}
          style={{ "--value": `${clamped}%` } as CSSProperties}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
