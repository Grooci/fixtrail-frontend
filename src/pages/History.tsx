import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSession } from "../services/authService";
import { historyService } from "../services/historyService";
import RatingModal from "../components/RatingModal";
import Stars from "../components/Stars";
import type { JobStatus, ProviderHistoryItem, RequestSummary } from "../types";

const PAGE_SIZE = 10;
const STATUSES: JobStatus[] = ["Requested", "Accepted", "In Progress", "Completed"];

export default function History() {
  const isCustomer = getSession()?.role === "customer";
  const home = isCustomer ? "/customer" : "/provider";

  const [status, setStatus] = useState<JobStatus | "">("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [offset, setOffset] = useState(0);

  const [total, setTotal] = useState(0);
  const [customerItems, setCustomerItems] = useState<RequestSummary[]>([]);
  const [providerItems, setProviderItems] = useState<ProviderHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rating, setRating] = useState<RequestSummary | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (isCustomer) {
        const res = await historyService.customer(status, sort, PAGE_SIZE, offset);
        setCustomerItems(res.items);
        setTotal(res.total);
      } else {
        const res = await historyService.provider(status, sort, PAGE_SIZE, offset);
        setProviderItems(res.items);
        setTotal(res.total);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load history.");
    } finally {
      setLoading(false);
    }
  }, [isCustomer, status, sort, offset]);

  useEffect(() => { load(); }, [load]);

  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + PAGE_SIZE, total);

  return (
    <main className="page">
      <Link to={home}>Back to dashboard</Link>
      <h1>{isCustomer ? "Request history" : "Job history"}</h1>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "12px 0" }}>
        <label>
          Status{" "}
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value as JobStatus | ""); setOffset(0); }}
          >
            <option value="">All</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label>
          Sort{" "}
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value as "newest" | "oldest"); setOffset(0); }}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      </div>

      {loading && <p>Loading...</p>}
      {error && (
        <p style={{ color: "#c0392b" }}>
          {error} <button onClick={load}>Retry</button>
        </p>
      )}

      {!loading && !error && total === 0 && (
        <p>
          {status
            ? `No ${isCustomer ? "requests" : "jobs"} with status "${status}".`
            : isCustomer
              ? "You haven't sent any requests yet."
              : "You haven't taken any jobs yet."}
        </p>
      )}

      {!loading && !error && isCustomer && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {customerItems.map((r) => (
            <li key={r.request_id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <strong>{r.category_name ?? "General"}</strong>
                <span>{r.status}</span>
              </div>
              <p style={{ margin: "6px 0" }}>{r.description}</p>
              <small className="muted">
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

      {!loading && !error && !isCustomer && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {providerItems.map((j) => (
            <li key={j.job_id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <strong>{j.category_name ?? "General"}</strong>
                <span>{j.status}</span>
              </div>
              <p style={{ margin: "6px 0" }}>{j.description}</p>
              <small className="muted">
                {j.customer_name} · updated {new Date(j.updated_at).toLocaleDateString()}
              </small>
              {j.rating !== null && (
                <div style={{ marginTop: 8 }}>
                  <Stars value={j.rating} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {total > PAGE_SIZE && (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}>
            Previous
          </button>
          <span className="muted">{from}–{to} of {total}</span>
          <button disabled={to >= total} onClick={() => setOffset(offset + PAGE_SIZE)}>
            Next
          </button>
        </div>
      )}

      {rating && rating.job_id && (
        <RatingModal
          jobId={rating.job_id}
          providerName={rating.provider_name}
          onClose={() => setRating(null)}
          onSubmitted={() => { setRating(null); load(); }}
        />
      )}
    </main>
  );
}