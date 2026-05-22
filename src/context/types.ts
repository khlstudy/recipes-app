import type { AuthUser } from "../types";

export interface AuthContextValue {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (_email: string, _password: string) => Promise<void>;
  register: (_name: string, _email: string, _password: string) => Promise<void>;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

export interface SearchFocusContextValue {
  registerSearch: (_focus: (() => void) | null) => void;
  focusSearch: () => void;
}
