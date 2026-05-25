import type { UserProfile, AuthUser } from "../../../types";

export interface IdentityCardProps {
  profile: UserProfile;
  role: AuthUser["role"];
  saving: boolean;
  serverError: string | null;
  onLogout: () => void;
  onSave: (_values: { name: string; email: string }) => Promise<boolean>;
}

export interface IdentityFormValues {
  name: string;
  email: string;
}
