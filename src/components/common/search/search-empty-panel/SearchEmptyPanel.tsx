import Icon from "../../icon/Icon";
import { ICONS_PATH, RECIPE_ICON_IDS } from "../../recipe-card/utils";
import type { SearchEmptyPanelProps } from "./types";
import styles from "./SearchEmptyPanel.module.scss";

const SearchEmptyPanel = ({
  recentSearches,
  trendingSearches,
  onSelectSearch,
  onClearRecent,
}: SearchEmptyPanelProps) => {
  const showRecent = recentSearches.length > 0;
  const items = showRecent ? recentSearches : trendingSearches;

  if (items.length === 0) return null;

  return (
    <div className={styles["search-empty-panel"]}>
      <header className={styles["search-empty-panel__header"]}>
        <h3 className={styles["search-empty-panel__title"]}>
          {showRecent ? "Recent searches" : "Trending searches"}
        </h3>
        {showRecent && (
          <button
            type="button"
            className={styles["search-empty-panel__clear"]}
            onClick={onClearRecent}>
            Clear
          </button>
        )}
      </header>

      <ul className={styles["search-empty-panel__list"]}>
        {items.map((query) => (
          <li key={query}>
            <button
              type="button"
              className={styles["search-empty-panel__item"]}
              onClick={() =>
                onSelectSearch(query, showRecent ? undefined : "recipe")
              }>
              <Icon
                src={`${ICONS_PATH}${
                  showRecent ? RECIPE_ICON_IDS.clock : RECIPE_ICON_IDS.star
                }`}
                size={16}
                className={styles["search-empty-panel__icon"]}
              />
              <span className={styles["search-empty-panel__text"]}>
                {query}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchEmptyPanel;
