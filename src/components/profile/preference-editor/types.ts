import type { UserPreferences } from "../../../types";
import type { PreferenceGroupKey } from "../../../pages/profile-page/types";
import type { PreferenceSuggestionPools } from "../../../pages/profile-page/utils";

export interface PreferenceEditorProps {
  preferences: UserPreferences;
  pools: PreferenceSuggestionPools;
  saving: boolean;
  onChange: (_group: PreferenceGroupKey, _values: string[]) => void;
}
