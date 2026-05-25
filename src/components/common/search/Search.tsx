import { useEffect, useState, type ChangeEvent, type SubmitEvent } from "react";

import IconButton from "../icon-button/IconButton";
import SuggestionList from "../suggestion-list/SuggestionList";
import SearchEmptyPanel from "./search-empty-panel/SearchEmptyPanel";
import { HEADER_ICONS } from "../icon-button/utils";
import { matchSuggestions } from "./utils";
import type { SearchProps } from "./types";
import styles from "./Search.module.scss";

const Search = ({
  onSearch,
  onCommitSearch,
  placeholder = "Search by name, ingredient or tag",
  initialValue = "",
  suggestions = [],
  inputRef,
  recentSearches = [],
  trendingSearches = [],
  onClearRecent,
}: SearchProps) => {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const matches = matchSuggestions(suggestions, query);
  const hasQuery = query.trim().length > 0;
  const showSuggestions = isFocused && hasQuery && matches.length > 0;
  const showEmptyPanel = isFocused && !hasQuery;

  const commit = (value: string, type?: string) => {
    onSearch(value, type);
    if (value.trim()) onCommitSearch?.(value);
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    commit(query);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  const handleSelectSuggestion = (suggestion: string, type?: string) => {
    setQuery(suggestion);
    commit(suggestion, type);
    setIsFocused(false);
  };

  const handleSelectSearch = (value: string, type?: string) => {
    setQuery(value);
    commit(value, type);
    setIsFocused(false);
  };

  const handleClearRecent = () => {
    onClearRecent?.();
    setIsFocused(false);
  };

  return (
    <div className={styles.search}>
      <form className={styles.search__field} onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 120)}
          placeholder={placeholder}
          className={styles["search-input"]}
          autoComplete="off"
        />
        {query ? (
          <IconButton
            variant="action"
            iconSrc={HEADER_ICONS.cancel}
            label="clear search"
            onClick={handleClear}
          />
        ) : (
          <IconButton
            variant="action"
            iconSrc={HEADER_ICONS.search}
            label="search"
            type="submit"
          />
        )}
      </form>

      {showSuggestions && (
        <div className={styles.search__dropdown}>
          <SuggestionList
            suggestions={matches}
            onSelect={handleSelectSuggestion}
          />
        </div>
      )}

      {showEmptyPanel && (
        <div className={styles.search__dropdown}>
          <SearchEmptyPanel
            recentSearches={recentSearches}
            trendingSearches={trendingSearches}
            onSelectSearch={handleSelectSearch}
            onClearRecent={handleClearRecent}
          />
        </div>
      )}
    </div>
  );
};

export default Search;
