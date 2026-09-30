import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import type { Role } from "../types";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("customer");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const session = register({ name, email, password, role, phone });
      navigate(session.role === "customer" ? "/customer" : "/provider");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  }

  return (
    <main className="auth-page">
      <div className="card">
        <h1>Create account</h1>
        <p className="muted">Join FixTrail as a customer or a service provider.</p>

        <form onSubmit={handleSubmit}>
          <div className="role-toggle">
            <button
              type="button"
              className={role === "customer" ? "active" : ""}
              onClick={() => setRole("customer")}
            >
              I need a service
            </button>
            <button
              type="button"
              className={role === "provider" ? "active" : ""}
              onClick={() => setRole("provider")}
            >
              I offer a service
            </button>
          </div>

          <label>
            Full name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
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
            Phone (optional)
            <input value={phone} onChange={(e) => setPhone(e.target.value)} />
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
          <button type="submit">Create account</button>
        </form>

        <p className="muted">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}
