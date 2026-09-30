import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/authService";

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
      <section className="card">
        <h2>Customer dashboard</h2>
        <p className="muted">
          Service categories, the request form, and request history arrive in Module 3.
        </p>
      </section>
    </main>
  );
}
