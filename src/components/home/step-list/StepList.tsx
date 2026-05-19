import type { StepListProps } from "./types";

import styles from "./StepList.module.scss";

const StepList = ({ title, description, steps }: StepListProps) => (
  <section className={styles["step-list"]}>
    <h1 className={styles["step-list__title"]}>{title}</h1>

    {description && (
      <p className={styles["step-list__description"]}>{description}</p>
    )}

    <ul className={styles["step-list__items"]}>
      {steps.map((step, index) => (
        <li key={step} className={styles["step-list__item"]}>
          <span className={styles["step-list__number"]}>{index + 1}</span>
          <span>{step}</span>
        </li>
      ))}
    </ul>
  </section>
);

export default StepList;
