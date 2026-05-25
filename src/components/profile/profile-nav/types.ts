import type {
  ProfileTab,
  ProfileTabSchema,
} from "../../../pages/profile-page/types";

export interface ProfileNavProps {
  tabs: ProfileTabSchema[];
  activeTab: ProfileTab;
  onSelect: (_tab: ProfileTab) => void;
}
