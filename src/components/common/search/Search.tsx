import { useState, type ChangeEvent, type SubmitEvent } from "react";
import IconButton from "../icon-button/IconButton";
import { HEADER_ICONS } from "../icon-button/utils";
import type { SearchProps } from "./types";
import styles from "./Search.module.scss";

const Search = ({
  onSearch,
  placeholder = "Search by name, ingredient or tag",
}: SearchProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <form className={styles.search} onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className={styles["search-input"]}
        autoComplete="off"
      />
      <IconButton iconSrc={HEADER_ICONS.search} label="search" type="submit" />
    </form>
  );
};

export default Search;
