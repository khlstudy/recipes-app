import type { AuthUser } from "../types";
import type { ToastInput } from "../components/common/toast/types";

export interface AuthContextValue {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (_email: string, _password: string) => Promise<void>;
  register: (_name: string, _email: string, _password: string) => Promise<void>;
  logout: () => void;
  consumeJustLoggedOut: () => boolean;
  updateCurrentUser: (
    _changes: Partial<Pick<AuthUser, "name" | "email">>
  ) => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

export interface SearchFocusContextValue {
  registerSearch: (_focus: (() => void) | null) => void;
  focusSearch: () => void;
}

export interface ToastContextValue {
  showToast: (_input: ToastInput) => string;
  dismissToast: (_id: string) => void;
}
