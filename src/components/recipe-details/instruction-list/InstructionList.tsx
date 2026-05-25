import { useState } from "react";

import { classNames } from "../../../utils/classNames";
import StatusPill from "../../common/status-pill/StatusPill";
import type { InstructionListProps } from "./types";
import styles from "./InstructionList.module.scss";

const InstructionList = ({ steps }: InstructionListProps) => {
  const [doneSteps, setDoneSteps] = useState<Set<string>>(new Set());

  const toggleStep = (stepKey: string) => {
    setDoneSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepKey)) next.delete(stepKey);
      else next.add(stepKey);
      return next;
    });
  };

  return (
    <ol className={styles["instruction-list"]}>
      {steps.map((step, position) => {
        const stepKey = step.text;
        const isDone = doneSteps.has(stepKey);
        return (
          <li key={stepKey} className={styles["instruction-list__slot"]}>
            <button
              type="button"
              aria-pressed={isDone}
              onClick={() => toggleStep(stepKey)}
              className={classNames(
                styles["instruction-list__item"],
                isDone ? styles["instruction-list__item--done"] : null
              )}>
              <span
                className={styles["instruction-list__face"]}
                aria-hidden={isDone}>
                <span className={styles["instruction-list__number"]}>
                  {position + 1}
                </span>
                <span className={styles["instruction-list__text"]}>
                  {step.text}
                </span>
              </span>
              <span
                className={`${styles["instruction-list__face"]} ${styles["instruction-list__face--back"]}`}
                aria-hidden={!isDone}>
                <span
                  className={`${styles["instruction-list__number"]} ${styles["instruction-list__number--done"]}`}>
                  {position + 1}
                </span>
                <span className={styles["instruction-list__text"]}>
                  {step.text}
                </span>
                <StatusPill tone="done" label="Done" />
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
};

export default InstructionList;
