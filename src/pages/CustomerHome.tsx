import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/authService";
import CustomerDashboard from "./CustomerDashboard";

export default function CustomerHome() {
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
          <span className="muted">{user?.name} (Customer)</span>
          <button onClick={handleLogout}>Log out</button>
        </div>
      </header>

      <nav style={{ display: "flex", gap: 16, flexWrap: "wrap", margin: "12px 0" }}>
        <Link to="/categories">Browse services</Link>
        <Link to="/providers">Find providers</Link>
        <Link to="/requests/new">New request</Link>
        <Link to="/history">History</Link>
      </nav>

      <section className="card">
        <CustomerDashboard />
      </section>
    </main>
  );
}
