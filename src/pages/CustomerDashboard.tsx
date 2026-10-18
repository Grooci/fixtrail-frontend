import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dashboardService } from "../services/dashboardService";
import RatingModal from "../components/RatingModal";
import StatusBadge from "../components/StatusBadge";
import type { CustomerDashboard as Data, JobStatus, RequestSummary } from "../types";

const STAT_ORDER: JobStatus[] = ["Requested", "Accepted", "In Progress", "Completed"];

export default function CustomerDashboard() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rating, setRating] = useState<RequestSummary | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await dashboardService.customer());
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
        {STAT_ORDER.map((s) => (
          <div key={s} className="stat">
            <div className="stat-value">{data.counts[s] ?? 0}</div>
            <div className="stat-label">{s}</div>
          </div>
        ))}
      </div>

      <div className="dash-section">
        <div className="section-head">
          <h3>Recent requests</h3>
          <Link to="/history">View all ({data.total_requests})</Link>
        </div>

        {data.recent.length === 0 ? (
          <div className="empty">
            You haven't made any requests yet.{" "}
            <Link to="/requests/new">Create your first request</Link>
          </div>
        ) : (
          <ul className="list">
            {data.recent.map((r) => (
              <li key={r.request_id} className="item">
                <div className="item-head">
                  <strong>{r.category_name ?? "General"}</strong>
                  <StatusBadge status={r.status} />
                </div>
                <p>{r.description}</p>
                <small className="muted">
                  {r.provider_name ? `Provider: ${r.provider_name} · ` : ""}
                  {new Date(r.created_at).toLocaleDateString()}
                </small>
                {r.status === "Completed" && r.job_id && (
                  <div className="item-actions">
                    {r.has_review ? (
                      <span className="reviewed">Reviewed</span>
                    ) : (
                      <button className="btn-outline btn-sm" onClick={() => setRating(r)}>
                        Rate this job
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {rating && rating.job_id && (
        <RatingModal
          jobId={rating.job_id}
          providerName={rating.provider_name}
          onClose={() => setRating(null)}
          onSubmitted={() => { setRating(null); load(); }}
        />
      )}
    </div>
  );
}