import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/authService";
import ProviderDashboard from "./ProviderDashboard";

export default function ProviderHome() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <main className="page">
      <header className="topbar">
        <strong>FixTrail</strong>
        <div>
          <span className="muted">{user?.name} (Provider)</span>
          <button onClick={handleLogout}>Log out</button>
        </div>
      </header>

      <nav style={{ display: "flex", gap: 16, flexWrap: "wrap", margin: "12px 0" }}>
        <Link to="/provider/profile">My profile and categories</Link>
        <Link to="/provider/requests">Incoming requests</Link>
        <Link to="/provider/jobs">My jobs</Link>
        <Link to="/history">History</Link>
      </nav>

      <section className="card">
        <ProviderDashboard />
      </section>
    </main>
  );
}
