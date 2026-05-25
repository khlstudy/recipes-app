import { useComparisonContext } from "../../context/ComparisonContext";
import RecipeComparisonTable from "../../components/recipe-comparison/recipe-comparison-table/RecipeComparisonTable";
import StepList from "../../components/home/step-list/StepList";

import styles from "./RecipeComparison.module.scss";

const RecipeComparison = () => {
  const { comparisonList, toggle } = useComparisonContext();
  const isEmpty = comparisonList.length === 0;

  return (
    <div className={styles["recipe-comparison-page"]}>
      {isEmpty ? (
        <StepList
          title="Recipe Comparison"
          description="Pick up to 4 recipes to line up their cooking time, difficulty, nutrition, and ratings side by side. Add recipes from the catalog or any recipe card using the scales button."
        />
      ) : (
        <header className={styles["recipe-comparison-page__header"]}>
          <h1 className={styles["recipe-comparison-page__title"]}>
            Recipe Comparison
          </h1>
          <p className={styles["recipe-comparison-page__subtitle"]}>
            Comparing {comparisonList.length}/4 recipe
            {comparisonList.length > 1 ? "s" : ""}
          </p>
        </header>
      )}

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
