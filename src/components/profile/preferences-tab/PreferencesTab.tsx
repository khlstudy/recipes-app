import ProfileSection from "../profile-section/ProfileSection";
import PreferenceEditor from "../preference-editor/PreferenceEditor";
import { ICONS_PATH, RECIPE_ICON_IDS } from "../../common/recipe-card/utils";
import type { PreferencesTabProps } from "./types";

const PreferencesTab = ({
  preferences,
  pools,
  saving,
  onPreferenceChange,
}: PreferencesTabProps) => (
  <ProfileSection
    title="Preference Engine"
    iconSrc={`${ICONS_PATH}${RECIPE_ICON_IDS.salad}`}
    subtitle="Tune what powers your personalized recommendations.">
    <PreferenceEditor
      preferences={preferences}
      pools={pools}
      saving={saving}
      onChange={onPreferenceChange}
    />
  </ProfileSection>
);

export default PreferencesTab;
