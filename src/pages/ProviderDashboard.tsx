import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dashboardService } from "../services/dashboardService";
import Stars from "../components/Stars";
import type { ProviderDashboard as Data } from "../types";

export default function ProviderDashboard() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await dashboardService.provider());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <p>Loading your dashboard...</p>;
  if (error) {
    return (
      <p style={{ color: "#c0392b" }}>
        {error} <button onClick={load}>Retry</button>
      </p>
    );
  }
  if (!data) return null;

  const stats = [
    { label: "Open requests", value: data.available_requests, to: "/provider/requests" },
    { label: "Active jobs", value: data.active_jobs },
    { label: "Completed", value: data.completed_jobs },
  ];

  return (
    <div>
      <h2>Your dashboard</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{s.value}</div>
            <div style={{ color: "#666" }}>{s.label}</div>
            {s.to && <Link to={s.to}>Browse</Link>}
          </div>
        ))}
        <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 28, fontWeight: 600 }}>
            {data.total_reviews > 0 ? data.average_rating.toFixed(1) : "–"}
          </div>
          <Stars value={data.average_rating} />
          <div style={{ color: "#666" }}>
            {data.total_reviews} review{data.total_reviews === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
        <h3 style={{ margin: 0 }}>Active jobs</h3>
        <Link to="/history">Job history</Link>
      </div>

      {data.active.length === 0 ? (
        <p>No active jobs right now. <Link to="/provider/requests">Browse open requests</Link></p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {data.active.map((j) => (
            <li key={j.job_id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <strong>{j.category_name ?? "General"}</strong>
                <span>{j.status}</span>
              </div>
              <p style={{ margin: "6px 0" }}>{j.description}</p>
              <small style={{ color: "#666" }}>
                {j.customer_name}
                {j.location ? ` · ${j.location}` : ""} · updated {new Date(j.updated_at).toLocaleDateString()}
              </small>
            </li>
          ))}
        </ul>
      )}

      <h3 style={{ marginTop: 24 }}>Recent reviews</h3>
      {data.recent_reviews.length === 0 ? (
        <p>No reviews yet. They appear here after customers rate your completed jobs.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {data.recent_reviews.map((r) => (
            <li key={r.id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{r.reviewer_name}</strong>
                <Stars value={r.rating} />
              </div>
              {r.comment && <p style={{ margin: "6px 0" }}>{r.comment}</p>}
              <small style={{ color: "#666" }}>{new Date(r.created_at).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}