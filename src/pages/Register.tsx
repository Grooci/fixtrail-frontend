import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { register } from "../services/authService";
import AuthLayout from "../components/AuthLayout";
import type { Role } from "../types";

export default function Register() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(
    params.get("role") === "provider" ? "provider" : "customer"
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const session = await register({
        name,
        email,
        password,
        role,
        phone: phone.trim() || undefined,
      });
      navigate(session.role === "customer" ? "/customer" : "/provider/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout variant={role}>
      <h1>Create your account</h1>
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
            autoComplete="email"
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
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>

        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="muted">
        Already registered? <Link to={`/login?role=${role}`}>Log in</Link>
      </p>
    </AuthLayout>
  );
}
