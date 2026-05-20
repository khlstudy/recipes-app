import { classNames } from "../../../utils/classNames";
import { FILTER_PRESETS } from "./utils";
import type { MatchFilterProps } from "./types";
import styles from "./MatchFilter.module.scss";

const MatchFilter = ({ value, counts, onChange }: MatchFilterProps) => (
  <div
    className={styles["match-filter"]}
    role="tablist"
    aria-label="Filter recipes by how ready you are to cook them">
    {FILTER_PRESETS.map((preset) => (
      <button
        key={preset.key}
        type="button"
        role="tab"
        aria-selected={value === preset.key}
        className={classNames(
          styles["match-filter__chip"],
          value === preset.key ? styles["match-filter__chip--active"] : null
        )}
        onClick={() => onChange(preset.key)}>
        {preset.label}
        <span className={styles["match-filter__count"]}>
          {counts[preset.key]}
        </span>
      </button>
    ))}
  </div>
);

export default MatchFilter;
