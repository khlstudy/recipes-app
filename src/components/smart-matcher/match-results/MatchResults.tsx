import MatchCard from "../match-card/MatchCard";
import type { MatchResultsProps } from "./types";
import styles from "./MatchResults.module.scss";

const MatchResults = ({
  matches,
  onRecipeClick,
  emptyMessage,
}: MatchResultsProps) => {
  if (matches.length === 0) {
    return <p className={styles["match-results__empty"]}>{emptyMessage}</p>;
  }

  return (
    <ul className={styles["match-results"]}>
      {matches.map((match) => (
        <li key={match.recipe.id} className={styles["match-results__item"]}>
          <MatchCard
            match={match}
            onClick={() => onRecipeClick(match.recipe.id)}
          />
        </li>
      ))}
    </ul>
  );
};

export default MatchResults;
