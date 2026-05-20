import type { ChangeEvent } from "react";

import Icon from "../../common/icon/Icon";
import { classNames } from "../../../utils/classNames";
import { ICONS_PATH, RECIPE_ICON_IDS } from "../../common/recipe-card/utils";
import { HEADER_ICONS } from "../../common/icon-button/utils";
import type { SortKey } from "../../../pages/catalog-page/types";
import type { CatalogToolbarProps } from "./types";
import styles from "./CatalogToolbar.module.scss";

const CatalogToolbar = ({
  resultCount,
  searchQuery,
  searchType,
  sortBy,
  sortOptions,
  onSortChange,
  onOpenFilters,
  onFocusSearch,
}: CatalogToolbarProps) => {
  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value as SortKey);
  };

  const isSingular = resultCount === 1;
  const queryClassName = classNames(
    styles["catalog-toolbar__query"],
    searchType && styles[`catalog-toolbar__query--${searchType}`]
  );

  return (
    <div className={styles["catalog-toolbar"]}>
      <button
        type="button"
        className={styles["catalog-toolbar__filters-button"]}
        onClick={onOpenFilters}>
        <Icon
          src={`${ICONS_PATH}${RECIPE_ICON_IDS.list}`}
          size={18}
          className={styles["catalog-toolbar__filters-icon"]}
        />
        Filters
      </button>

      <button
        type="button"
        className={styles["catalog-toolbar__count"]}
        onClick={onFocusSearch}
        title="Search recipes">
        <Icon
          src={HEADER_ICONS.search}
          size={15}
          className={styles["catalog-toolbar__search-icon"]}
        />
        {searchQuery ? (
          <span>
            Found{" "}
            <strong className={styles["catalog-toolbar__number"]}>
              {resultCount}
            </strong>{" "}
            {isSingular ? "result" : "results"} for{" "}
            <span className={queryClassName}>“{searchQuery}”</span>
          </span>
        ) : (
          <span>
            Showing all{" "}
            <strong className={styles["catalog-toolbar__number"]}>
              {resultCount}
            </strong>{" "}
            {isSingular ? "recipe" : "recipes"}
            <span className={styles["catalog-toolbar__hint"]}>
              {" "}
              — use the search bar to find a specific one
            </span>
          </span>
        )}
      </button>

      <label className={styles["catalog-toolbar__sort"]}>
        <span className={styles["catalog-toolbar__sort-label"]}>Sort by</span>
        <span className={styles["catalog-toolbar__sort-control"]}>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className={styles["catalog-toolbar__sort-select"]}>
            {sortOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </span>
      </label>
    </div>
  );
};

export default CatalogToolbar;
