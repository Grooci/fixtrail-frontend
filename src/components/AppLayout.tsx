import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/authService";

const NAV = {
  customer: [
    { to: "/customer", label: "Home", end: true },
    { to: "/categories", label: "Services" },
    { to: "/providers", label: "Providers" },
    { to: "/requests/new", label: "New request" },
    { to: "/history", label: "History" },
  ],
  provider: [
    { to: "/provider", label: "Home", end: true },
    { to: "/provider/requests", label: "Requests" },
    { to: "/provider/jobs", label: "My jobs" },
    { to: "/provider/profile", label: "Profile" },
    { to: "/history", label: "History" },
  ],
};

export default function AppLayout() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const role = user?.role === "provider" ? "provider" : "customer";
  const links = NAV[role];

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className={`app-shell role-${role}`}>
      <header className="app-header">
        <div className="app-header-inner">
          <span className="brand">FixTrail</span>
          <nav className="app-nav">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="app-user">
            <span className="muted app-user-name">{user?.name}</span>
            <button className="btn-ghost" onClick={handleLogout}>Log out</button>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}