import { NUTRITION_ITEMS, calcPercent } from "./utils";
import type { NutritionPanelProps } from "./types";
import styles from "./NutritionPanel.module.scss";

const NutritionPanel = ({ nutrition }: NutritionPanelProps) => (
  <ul className={styles["nutrition-panel"]}>
    {NUTRITION_ITEMS.map((item) => {
      const value = nutrition[item.key];
      const percent = calcPercent(value, item.dailyValue);
      return (
        <li
          key={item.key}
          className={`${styles["nutrition-panel__card"]} ${styles[`nutrition-panel__card--${item.accent}`]}`}>
          <div
            className={styles["nutrition-panel__ring"]}
            style={{ "--percent": `${percent}%` } as React.CSSProperties}>
            <div className={styles["nutrition-panel__ring-inner"]}>
              <span className={styles["nutrition-panel__value"]}>{value}</span>
              <span className={styles["nutrition-panel__unit"]}>
                {item.unit}
              </span>
            </div>
          </div>
          <span className={styles["nutrition-panel__label"]}>{item.label}</span>
          <span className={styles["nutrition-panel__dv"]} title="Daily Value">
            {percent}% DV
          </span>
        </li>
      );
    })}
  </ul>
);

export default NutritionPanel;
