import { classNames } from "../../../utils/classNames";
import type { StatusPillProps } from "./types";

import styles from "./StatusPill.module.scss";

const StatusPill = ({ tone, label, className }: StatusPillProps) => (
  <span
    className={classNames(
      styles["status-pill"],
      styles[`status-pill--${tone}`],
      className
    )}>
    {label}
  </span>
);

export default StatusPill;
