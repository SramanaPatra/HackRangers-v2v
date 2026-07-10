import { Navigate } from "react-router-dom";
import { getToken } from "../api/client.js";

export default function RequireAuth({ children }) {
  const token = getToken();
  if (!token) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
}