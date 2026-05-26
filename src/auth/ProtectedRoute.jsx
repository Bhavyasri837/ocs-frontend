import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function ProtectedRoute({ children, allowedRoles, redirectTo = "/login" }) {
  const { isLoggedIn, role } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    alert("Please login to continue");
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Role mismatch: send user to home. Backend will still block admin ops.
    return <Navigate to="/" replace />;
  }

  return children;
}

