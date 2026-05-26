import { useContext } from "react";
import { AuthContext } from "./AuthContextBase";

export function useAuthFromContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

