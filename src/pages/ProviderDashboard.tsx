import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dashboardService } from "../services/dashboardService";
import Stars from "../components/Stars";
import StatusBadge from "../components/StatusBadge";
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

  if (loading) return <p className="muted">Loading your dashboard...</p>;
  if (error) {
    return (
      <p className="error">
        {error} <button className="link-btn" onClick={load}>Retry</button>
      </p>
    );
  }
  if (!data) return null;

  return (
    <div>
      <div className="stats">
        <div className="stat">
          <div className="stat-value">{data.available_requests}</div>
          <div className="stat-label">Open requests</div>
        </div>
        <div className="stat">
          <div className="stat-value">{data.active_jobs}</div>
          <div className="stat-label">Active jobs</div>
        </div>
        <div className="stat">
          <div className="stat-value">{data.completed_jobs}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat">
          <div className="stat-value">
            {data.total_reviews > 0 ? data.average_rating.toFixed(1) : "–"}
          </div>
          <Stars value={data.average_rating} />
          <div className="stat-label">
            {data.total_reviews} review{data.total_reviews === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      <div className="dash-section">
        <div className="section-head">
          <h3>Active jobs</h3>
          <Link to="/provider/jobs">Manage jobs</Link>
        </div>
        {data.active.length === 0 ? (
          <div className="empty">
            No active jobs right now. <Link to="/provider/requests">Browse open requests</Link>
          </div>
        ) : (
          <ul className="list">
            {data.active.map((j) => (
              <li key={j.job_id} className="item">
                <div className="item-head">
                  <strong>{j.category_name ?? "General"}</strong>
                  <StatusBadge status={j.status} />
                </div>
                <p>{j.description}</p>
                <small className="muted">
                  {j.customer_name}
                  {j.location ? ` · ${j.location}` : ""} · updated{" "}
                  {new Date(j.updated_at).toLocaleDateString()}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="dash-section">
        <div className="section-head">
          <h3>Recent reviews</h3>
        </div>
        {data.recent_reviews.length === 0 ? (
          <div className="empty">
            No reviews yet. They appear here after customers rate your completed jobs.
          </div>
        ) : (
          <ul className="list">
            {data.recent_reviews.map((r) => (
              <li key={r.id} className="item">
                <div className="item-head">
                  <strong>{r.reviewer_name}</strong>
                  <Stars value={r.rating} />
                </div>
                {r.comment && <p>{r.comment}</p>}
                <small className="muted">{new Date(r.created_at).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}