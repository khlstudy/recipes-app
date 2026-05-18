import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

import type { AuthResponse } from "../api/types";
import type { AuthUser } from "../types";
import type { AuthContextValue } from "./types";

import { apiClient } from "../api/client";
import { ENDPOINTS } from "../api/endpoints";

const STORAGE_KEY = "auth_user";

const AuthContext = createContext<AuthContextValue | null>(null);

function loadStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(
    loadStoredUser
  );

  const persistUser = useCallback((user: AuthUser | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      const res = await apiClient<AuthResponse>(ENDPOINTS.LOGIN, {
        method: "POST",
        body: { email, password },
      });
      persistUser(res.user);
    },
    [persistUser]
  );

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<void> => {
      const res = await apiClient<AuthResponse>(ENDPOINTS.REGISTER, {
        method: "POST",
        body: { name, email, password },
      });
      persistUser(res.user);
    },
    [persistUser]
  );

  const logout = useCallback(() => {
    persistUser(null);
  }, [persistUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: currentUser !== null,
        login,
        register,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
