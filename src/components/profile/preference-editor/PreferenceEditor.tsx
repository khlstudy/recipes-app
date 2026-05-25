import Icon from "../../common/icon/Icon";
import ChipGroup from "../../common/chip-group/ChipGroup";
import { ICONS_PATH } from "../../common/recipe-card/utils";
import {
  PREFERENCE_GROUPS,
  POPULAR_PICKS_LIMIT,
  normalizeChip,
} from "../../../pages/profile-page/utils";
import type { PreferenceGroupKey } from "../../../pages/profile-page/types";
import type { PreferenceEditorProps } from "./types";

import styles from "./PreferenceEditor.module.scss";

const PreferenceEditor = ({
  preferences,
  pools,
  saving,
  onChange,
}: PreferenceEditorProps) => {
  const addValue = (group: PreferenceGroupKey, value: string) => {
    const normalized = normalizeChip(value);
    const current = preferences[group];
    if (!normalized || current.includes(normalized)) return;
    onChange(group, [...current, normalized]);
  };

  const removeValue = (group: PreferenceGroupKey, value: string) => {
    onChange(
      group,
      preferences[group].filter((item) => item !== value)
    );
  };

  return (
    <div className={styles["preference-editor"]}>
      {PREFERENCE_GROUPS.map((group) => (
        <article key={group.key} className={styles["preference-editor__group"]}>
          <header className={styles["preference-editor__head"]}>
            <span className={styles["preference-editor__icon"]}>
              <Icon src={`${ICONS_PATH}${group.iconId}`} size={16} />
            </span>
            <div className={styles["preference-editor__meta"]}>
              <h3 className={styles["preference-editor__title"]}>
                {group.title}
              </h3>
              <p className={styles["preference-editor__hint"]}>{group.hint}</p>
            </div>
          </header>

          <ChipGroup
            values={preferences[group.key]}
            suggestions={pools[group.key]}
            quickPicks={pools[group.key].slice(0, POPULAR_PICKS_LIMIT)}
            placeholder={group.placeholder}
            emptyLabel="Nothing added yet."
            disabled={saving}
            onAdd={(value) => addValue(group.key, value)}
            onRemove={(value) => removeValue(group.key, value)}
          />
        </article>
      ))}
    </div>
  );
};

export default PreferenceEditor;
