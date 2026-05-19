import { useComparisonContext } from "../../context/ComparisonContext";
import RecipeComparisonTable from "../../components/recipe-comparison/recipe-comparison-table/RecipeComparisonTable";

import styles from "./RecipeComparison.module.scss";

const RecipeComparison = () => {
  const { comparisonList, toggle } = useComparisonContext();

  return (
    <div className={styles["recipe-comparison-page"]}>
      <header className={styles["recipe-comparison-page__header"]}>
        <h1 className={styles["recipe-comparison-page__title"]}>
          Recipe Comparison
        </h1>
        {comparisonList.length > 0 && (
          <p className={styles["recipe-comparison-page__subtitle"]}>
            Comparing {comparisonList.length}/4 recipe
            {comparisonList.length > 1 ? "s" : ""}
          </p>
        )}
      </header>

      <RecipeComparisonTable
        recipes={comparisonList}
        onRemove={(id: string) =>
          toggle(comparisonList.find((r) => r.id === id)!)
        }
      />
    </div>
  );
};

export default RecipeComparison;
