import type { AuthUser } from "../types";

export interface AuthContextValue {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (_email: string, _password: string) => Promise<void>;
  register: (_name: string, _email: string, _password: string) => Promise<void>;
  logout: () => void;
}
