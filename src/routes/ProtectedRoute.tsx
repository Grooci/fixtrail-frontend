import { Navigate, Outlet } from "react-router-dom";
import { getSession } from "../services/authService";
import type { Role } from "../types";

interface Props {
  role?: Role;
}

export default function ProtectedRoute({ role }: Props) {
  const session = getSession();

  // Not logged in: send to login
  if (!session) return <Navigate to="/login" replace />;

  // Logged in but wrong role: send to their own home
  if (role && session.role !== role) {
    return (
      <Navigate to={session.role === "customer" ? "/customer" : "/provider"} replace />
    );
  }

  return <Outlet />;
}
