import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/authService";

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
      <section className="card">
        <h2>Provider dashboard</h2>
        <p className="muted">
          Profile setup, incoming requests, and job status tracking arrive in Module 4.
        </p>
      </section>
    </main>
  );
}
