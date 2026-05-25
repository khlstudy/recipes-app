import { useRef, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

import { useAuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, consumeJustLoggedOut } = useAuthContext();
  const location = useLocation();

  // Consume the logout flag exactly once per redirect decision. Reading it
  // directly during render double-fires under StrictMode and re-prompts login
  // immediately after logout.
  const promptLoginRef = useRef<boolean | null>(null);
  if (!isAuthenticated && promptLoginRef.current === null) {
    promptLoginRef.current = !consumeJustLoggedOut();
  }

  if (!isAuthenticated) {
    const promptLogin = promptLoginRef.current ?? true;
    return (
      <Navigate
        to="/"
        state={
          promptLogin ? { openAuthModal: true, from: location.pathname } : null
        }
        replace
      />
    );
  }

  promptLoginRef.current = null;
  return <>{children}</>;
};

export default ProtectedRoute;
