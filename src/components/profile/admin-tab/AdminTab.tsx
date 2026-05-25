import { useMemo } from "react";
import { useNavigate } from "react-router";

import ProfileSection from "../profile-section/ProfileSection";
import RecipeForm from "../recipe-form/RecipeForm";
import Button from "../../common/button/Button";
import { ICONS_PATH, RECIPE_ICON_IDS } from "../../common/recipe-card/utils";
import { classNames } from "../../../utils/classNames";
import { recipeToFormState } from "../recipe-form/utils";

import type { AdminTabProps } from "./types";

import styles from "./AdminTab.module.scss";

const AdminTab = ({
  submitting,
  tagPool,
  dietPool,
  ingredientPool,
  unitPool,
  mode,
  editingRecipe,
  onCreateRecipe,
  onUpdateRecipe,
  onCancelEdit,
}: AdminTabProps) => {
  const navigate = useNavigate();
  const isEdit = mode === "edit" && editingRecipe !== null;

  const initialState = useMemo(
    () => (editingRecipe ? recipeToFormState(editingRecipe) : undefined),
    [editingRecipe]
  );

  const sectionTitle = isEdit ? "Edit Recipe" : "Create New Recipe";
  const sectionSubtitle = isEdit
    ? `Editing: ${editingRecipe.title}`
    : "Publish a new recipe to the catalog.";

  const sectionIcon = isEdit
    ? `${ICONS_PATH}${RECIPE_ICON_IDS.edit}`
    : `${ICONS_PATH}${RECIPE_ICON_IDS.add}`;

  return (
    <ProfileSection
      title={sectionTitle}
      iconSrc={sectionIcon}
      subtitle={sectionSubtitle}>
      <div className={styles["admin-tab"]}>
        {isEdit && (
          <div className={styles["admin-tab__pills"]}>
            <span
              className={classNames(
                styles["admin-tab__pill"],
                styles["admin-tab__pill--active"]
              )}>
              <span className={styles["admin-tab__pill-label"]}>Editing:</span>
              <button
                type="button"
                className={styles["admin-tab__pill-title"]}
                onClick={() => navigate(`/recipes/${editingRecipe.id}`)}
                aria-label={`Open recipe details for ${editingRecipe.title}`}>
                {editingRecipe.title}
              </button>
            </span>
            <Button
              type="button"
              variant="secondary-outline"
              size="small"
              onClick={onCancelEdit}>
              Cancel
            </Button>
          </div>
        )}

        <RecipeForm
          key={isEdit ? `edit-${editingRecipe.id}` : "create"}
          submitting={submitting}
          tagPool={tagPool}
          dietPool={dietPool}
          ingredientPool={ingredientPool}
          unitPool={unitPool}
          mode={isEdit ? "edit" : "create"}
          initialState={initialState}
          onSubmit={(recipe) =>
            isEdit
              ? onUpdateRecipe(editingRecipe.id, recipe)
              : onCreateRecipe(recipe)
          }
        />
      </div>
    </ProfileSection>
  );
};

export default AdminTab;
