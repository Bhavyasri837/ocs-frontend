
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";



export function RequireAuth({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export function RequireRole({ role, children }) {
  const { isLoggedIn, role: userRole } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export function RequireAdmin({ children }) {
  return <RequireRole role="admin">{children}</RequireRole>;
}

