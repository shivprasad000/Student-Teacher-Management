import { createContext, useContext, useState, ReactNode } from "react";

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginWithTokens: (access: string, refresh: string, isAdmin: boolean) => void;
  continueAsGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token")
  );
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("is_admin") === "true"
  );

  const loginWithTokens = (access: string, refresh: string, admin: boolean) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    localStorage.setItem("is_admin", String(admin));
    setIsAuthenticated(true);
    setIsAdmin(admin);
  };

  // Guests get read-only access without any token; the API's
  // IsAdminOrReadOnly permission class allows GETs from anyone.
  const continueAsGuest = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.setItem("is_admin", "false");
    setIsAuthenticated(true);
    setIsAdmin(false);
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isAdmin, loginWithTokens, continueAsGuest, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
