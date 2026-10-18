import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dashboardService } from "../services/dashboardService";
import RatingModal from "../components/RatingModal";
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

  if (loading) return <p>Loading your dashboard...</p>;
  if (error) {
    return (
      <p style={{ color: "#c0392b" }}>
        {error} <button onClick={load}>Retry</button>
      </p>
    );
  }
  if (!data) return null;

  return (
    <div>
      <h2>Your dashboard</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
        {STAT_ORDER.map((s) => (
          <div key={s} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{data.counts[s] ?? 0}</div>
            <div style={{ color: "#666" }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
        <h3 style={{ margin: 0 }}>Recent requests</h3>
        <Link to="/history">View all ({data.total_requests})</Link>
      </div>

      {data.recent.length === 0 ? (
        <p>You haven't made any requests yet. <Link to="/requests/new">Create your first request</Link></p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {data.recent.map((r) => (
            <li key={r.request_id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <strong>{r.category_name ?? "General"}</strong>
                <span>{r.status}</span>
              </div>
              <p style={{ margin: "6px 0" }}>{r.description}</p>
              <small style={{ color: "#666" }}>
                {r.provider_name ? `Provider: ${r.provider_name} · ` : ""}
                {new Date(r.created_at).toLocaleDateString()}
              </small>
              {r.status === "Completed" && r.job_id && (
                <div style={{ marginTop: 8 }}>
                  {r.has_review ? (
                    <span style={{ color: "#2e7d32" }}>Reviewed ✓</span>
                  ) : (
                    <button onClick={() => setRating(r)}>Rate this job</button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

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