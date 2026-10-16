import { Link, useNavigate } from "react-router-dom";
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
        <ul>
          <li>
            <Link to="/provider/profile">My profile and categories</Link>
          </li>
          <li>
            <Link to="/provider/requests">Incoming requests</Link>
          </li>
          <li>
            <Link to="/provider/jobs">My jobs</Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
