import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import type { ChipGroupProps } from "./types";
import Icon from "../icon/Icon";
import SuggestionList from "../suggestion-list/SuggestionList";
import { CHIP_REMOVE_ICON, matchChipSuggestions } from "./utils";

import styles from "./ChipGroup.module.scss";

const ChipGroup = ({
  values,
  placeholder,
  emptyLabel,
  onAdd,
  onRemove,
  suggestions = [],
  quickPicks = [],
  quickPickLabel = "Popular",
  disabled = false,
  suggestionsMaxVisible = 6,
}: ChipGroupProps) => {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const controlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (controlRef.current?.contains(event.target as Node)) return;
      setDraft("");
      inputRef.current?.blur();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const matches = matchChipSuggestions(suggestions, values, draft);
  const selectedSet = new Set(values.map((value) => value.toLowerCase()));
  const availablePicks = quickPicks.filter(
    (pick) => !selectedSet.has(pick.toLowerCase())
  );

  const commit = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setDraft("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commit(matches[0] ?? draft);
    } else if (event.key === "Backspace" && !draft && values.length > 0) {
      onRemove(values[values.length - 1]);
    }
  };

  return (
    <div className={styles["chip-group"]}>
      <div
        ref={controlRef}
        className={styles["chip-group__control"]}
        onClick={() => inputRef.current?.focus()}>
        {values.map((value) => (
          <span key={value} className={styles["chip-group__chip"]}>
            <span className={styles["chip-group__chip-label"]}>{value}</span>
            <button
              type="button"
              className={styles["chip-group__remove"]}
              onClick={(event) => {
                event.stopPropagation();
                onRemove(value);
              }}
              disabled={disabled}
              aria-label={`Remove ${value}`}>
              <Icon src={CHIP_REMOVE_ICON} size={9} />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          className={styles["chip-group__input"]}
          value={draft}
          placeholder={values.length === 0 ? placeholder : ""}
          autoComplete="off"
          aria-label={emptyLabel}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />

        {matches.length > 0 && (
          <div className={styles["chip-group__suggestions"]}>
            <SuggestionList
              suggestions={matches}
              onSelect={(value) => commit(value)}
              maxVisible={suggestionsMaxVisible}
            />
          </div>
        )}
      </div>

      {availablePicks.length > 0 && (
        <p className={styles["chip-group__picks"]}>
          <span className={styles["chip-group__picks-label"]}>
            {quickPickLabel}:
          </span>
          {availablePicks.map((pick) => (
            <button
              key={pick}
              type="button"
              className={styles["chip-group__pick"]}
              onClick={() => commit(pick)}
              disabled={disabled}>
              + {pick}
            </button>
          ))}
        </p>
      )}
    </div>
  );
};

export default ChipGroup;
