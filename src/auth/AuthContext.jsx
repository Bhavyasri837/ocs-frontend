import { useEffect, useMemo, useState } from "react";

import { clearAuthStorage, loadAuthFromStorage, saveAuthToStorage } from "./authStorage";
import { AuthContext } from "./AuthContextBase";



export function AuthProvider({ children }) {
  const loadedInitial = loadAuthFromStorage();
  const [isLoggedIn, setIsLoggedIn] = useState(loadedInitial.isLoggedIn);
  const [role, setRole] = useState(loadedInitial.role);

  useEffect(() => {
    // Persist auth state; ignore errors (storage can be blocked).
    saveAuthToStorage({ isLoggedIn, role });
  }, [isLoggedIn, role]);

  const logout = () => {
    clearAuthStorage();
    setIsLoggedIn(false);
    setRole("");
  };

  const value = useMemo(
    () => ({ isLoggedIn, role, setIsLoggedIn, setRole, logout }),
    [isLoggedIn, role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

