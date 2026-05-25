import type { AuthUser, UserProfile } from "../../../types";

export interface SettingsTabProps {
  profile: UserProfile;
  role: AuthUser["role"];
  savingProfile: boolean;
  profileError: string | null;
  onLogout: () => void;
  onSaveProfile: (_values: { name: string; email: string }) => Promise<boolean>;
}
