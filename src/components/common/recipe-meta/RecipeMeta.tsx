import Icon from "../icon/Icon";
import { ICONS_PATH } from "../recipe-card/utils";
import { getMetaItems } from "./utils";
import type { RecipeMetaProps } from "./types";
import styles from "./RecipeMeta.module.scss";

const RecipeMeta = ({ recipe }: RecipeMetaProps) => {
  const items = getMetaItems(recipe);

  return (
    <ul className={styles["recipe-meta"]}>
      {items.map((item) => (
        <li key={item.key} className={styles["recipe-meta__item"]}>
          <Icon
            src={`${ICONS_PATH}${item.iconId}`}
            size={16}
            className={styles["recipe-meta__icon"]}
          />
          {item.value}
        </li>
      ))}
    </ul>
  );
};

export default RecipeMeta;
