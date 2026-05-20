import type { CSSProperties } from "react";

import { classNames } from "../../../utils/classNames";
import {
  DEFAULT_MAX_VISIBLE,
  getSuggestionKey,
  normalizeSuggestion,
} from "./utils";
import type { SuggestionListProps } from "./types";
import styles from "./SuggestionList.module.scss";

const SuggestionList = ({
  suggestions,
  onSelect,
  maxVisible = DEFAULT_MAX_VISIBLE,
}: SuggestionListProps) => {
  if (suggestions.length === 0) return null;

  const items = suggestions.map(normalizeSuggestion);

  return (
    <ul
      className={styles["suggestion-list"]}
      style={{ "--max-visible": maxVisible } as CSSProperties}>
      {items.map((item) => (
        <li key={getSuggestionKey(item)}>
          <button
            type="button"
            className={styles["suggestion-list__item"]}
            onClick={() => onSelect(item.value, item.type)}>
            <span className={styles["suggestion-list__value"]}>
              {item.value}
            </span>
            {item.type && (
              <span
                className={classNames(
                  styles["suggestion-list__type"],
                  styles[`suggestion-list__type--${item.type}`]
                )}>
                {item.type}
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default SuggestionList;
