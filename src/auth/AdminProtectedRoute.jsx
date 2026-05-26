import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function AdminProtectedRoute({ children }) {
  const { isLoggedIn, role } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    alert("Please login to continue");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

