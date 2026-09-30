import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { resetDb } from "../services/storage";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const session = login(email, password);
      navigate(session.role === "customer" ? "/customer" : "/provider");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }

  function handleReset() {
    resetDb();
    setNotice("Demo data has been reset.");
  }

  return (
    <main className="auth-page">
      <div className="card">
        <h1>FixTrail</h1>
        <p className="muted">Log in to request or offer services.</p>

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          {notice && <p className="success">{notice}</p>}
          <button type="submit">Log in</button>
        </form>

        <p className="muted">
          No account? <Link to="/register">Register</Link>
        </p>

        <div className="demo-box">
          <strong>Demo accounts</strong>
          <p>Customer: customer@fixtrail.test</p>
          <p>Provider: brian@fixtrail.test</p>
          <p>Password: password123</p>
          <button type="button" className="link-btn" onClick={handleReset}>
            Reset demo data
          </button>
        </div>
      </div>
    </main>
  );
}
