import ProgressBar from "../../common/progress-bar/ProgressBar";
import RecipeMeta from "../../common/recipe-meta/RecipeMeta";
import { getIngredientGroups, formatOverlap, TIER_LABEL } from "./utils";
import type { MatchCardProps } from "./types";
import styles from "./MatchCard.module.scss";

const MatchCard = ({ match, onClick }: MatchCardProps) => {
  const { recipe, coverage, matchPercentage, tier } = match;
  const groups = getIngredientGroups(match);

  return (
    <article className={styles["match-card"]} onClick={onClick}>
      <div className={styles["match-card__image-wrapper"]}>
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className={styles["match-card__image"]}
        />
        <span className={styles[`match-card__tier--${tier}`]}>
          {TIER_LABEL[tier]}
        </span>
      </div>

      <div className={styles["match-card__content"]}>
        <h3 className={styles["match-card__title"]}>{recipe.title}</h3>

        <div className={styles["match-card__match"]}>
          <ProgressBar
            value={coverage}
            label="Ingredient match"
            ariaLabel={`${Math.round(coverage)}% of ingredients available`}
          />
          <span className={styles["match-card__overlap"]}>
            {formatOverlap(matchPercentage)}
          </span>
        </div>

        <div className={styles["match-card__groups"]}>
          {groups.map((group) => (
            <section
              key={group.key}
              className={styles[`match-card__group--${group.modifier}`]}>
              <h4 className={styles["match-card__group-title"]}>
                {group.title}
                <span className={styles["match-card__group-count"]}>
                  {group.items.length}
                </span>
              </h4>
              {group.items.length > 0 ? (
                <ul className={styles["match-card__ingredients"]}>
                  {group.items.map((name) => (
                    <li key={name} className={styles["match-card__ingredient"]}>
                      {name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles["match-card__group-empty"]}>
                  Nothing here — you are all set.
                </p>
              )}
            </section>
          ))}
        </div>

        <footer className={styles["match-card__footer"]}>
          <RecipeMeta recipe={recipe} />
          <span className={styles["match-card__calories"]}>
            {recipe.nutrition.calories} kcal
          </span>
        </footer>
      </div>
    </article>
  );
};

export default MatchCard;
