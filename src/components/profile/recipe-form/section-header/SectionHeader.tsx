import StatusPill from "../../../common/status-pill/StatusPill";

import type { SectionHeaderProps } from "./types";
import { classNames } from "../../../../utils/classNames";

import styles from "../RecipeForm.module.scss";

const SectionHeader = ({
  number,
  title,
  required = true,
  status,
  onLegendClick,
}: SectionHeaderProps) => (
  <header className={styles["recipe-form__header"]}>
    <h3 className={styles["recipe-form__legend"]} onClick={onLegendClick}>
      <span className={styles["recipe-form__number"]}>{number}</span>
      {title}
      {required && (
        <span className={styles["recipe-form__required"]} aria-hidden="true">
          *
        </span>
      )}
    </h3>
    <span
      className={classNames(
        styles["recipe-form__status"],
        status.visible && styles["recipe-form__status--visible"]
      )}
      aria-hidden={!status.visible}>
      <StatusPill tone={status.tone} label={status.label} />
    </span>
  </header>
);

export default SectionHeader;
