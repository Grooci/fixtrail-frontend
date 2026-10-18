import { Link } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import ProviderDashboard from "./ProviderDashboard";
import Icon, { type IconName } from "../components/Icon";

const TILES: { to: string; icon: IconName; title: string; text: string }[] = [
  { to: "/provider/requests", icon: "inbox", title: "Incoming requests", text: "Accept or decline new work." },
  { to: "/provider/jobs", icon: "briefcase", title: "My jobs", text: "Update the status of active jobs." },
  { to: "/provider/profile", icon: "user", title: "My profile", text: "Edit your bio, area and services." },
  { to: "/history", icon: "clock", title: "History", text: "Look back at completed work." },
];

export default function ProviderHome() {
  const user = getCurrentUser();
  const firstName = user?.name.split(" ")[0] ?? "there";

  return (
    <main className="page">
      <section
        className="hero"
        style={{ backgroundImage: "url(/images/home-provider.jpg)" }}
      >
        <div className="hero-inner">
          <p className="eyebrow">Provider</p>
          <h1>Welcome back, {firstName}.</h1>
          <p>Check new requests in your area and keep your jobs moving.</p>
          <Link to="/provider/requests" className="btn btn-light">View incoming requests</Link>
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

      <ProviderDashboard />
    </main>
  );
}
