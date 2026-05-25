import IdentityCard from "../identity-card/IdentityCard";
import ProfileSection from "../profile-section/ProfileSection";
import { ICONS_PATH, RECIPE_ICON_IDS } from "../../common/recipe-card/utils";
import type { SettingsTabProps } from "./types";

const SettingsTab = ({
  profile,
  role,
  savingProfile,
  profileError,
  onLogout,
  onSaveProfile,
}: SettingsTabProps) => (
  <ProfileSection
    title="Personal Information"
    iconSrc={`${ICONS_PATH}${RECIPE_ICON_IDS.chef}`}
    subtitle="Your account identity across the kitchen.">
    <IdentityCard
      profile={profile}
      role={role}
      saving={savingProfile}
      serverError={profileError}
      onLogout={onLogout}
      onSave={onSaveProfile}
    />
  </ProfileSection>
);

export default SettingsTab;
