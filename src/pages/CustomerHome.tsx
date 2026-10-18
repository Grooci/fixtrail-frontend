import { Link } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import CustomerDashboard from "./CustomerDashboard";
import Icon, { type IconName } from "../components/Icon";

const TILES: { to: string; icon: IconName; title: string; text: string }[] = [
  { to: "/categories", icon: "grid", title: "Browse services", text: "See everything you can book." },
  { to: "/providers", icon: "users", title: "Find providers", text: "Compare ratings and reviews." },
  { to: "/requests/new", icon: "plus", title: "New request", text: "Describe a problem and send it." },
  { to: "/history", icon: "clock", title: "History", text: "Review your past requests." },
];

export default function CustomerHome() {
  const user = getCurrentUser();
  const firstName = user?.name.split(" ")[0] ?? "there";

  return (
    <main className="page">
      <section
        className="hero"
        style={{ backgroundImage: "url(/images/home-customer.jpg)" }}
      >
        <div className="hero-inner">
          <p className="eyebrow">Customer</p>
          <h1>Hello, {firstName}.</h1>
          <p>What needs fixing today? Post a request and trusted local providers will respond.</p>
          <Link to="/requests/new" className="btn btn-light">Post a request</Link>
        </div>
      </section>

      <section className="tiles">
        {TILES.map((t) => (
          <Link key={t.to} to={t.to} className="tile">
            <span className="tile-icon"><Icon name={t.icon} /></span>
            <strong>{t.title}</strong>
            <span className="muted">{t.text}</span>
          </Link>
        ))}
      </section>

      <CustomerDashboard />
    </main>
  );
}
