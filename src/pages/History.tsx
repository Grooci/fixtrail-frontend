import { useCallback, useEffect, useState } from "react";
import { getSession } from "../services/authService";
import { historyService } from "../services/historyService";
import RatingModal from "../components/RatingModal";
import Stars from "../components/Stars";
import StatusBadge from "../components/StatusBadge";
import type { JobStatus, ProviderHistoryItem, RequestSummary } from "../types";

const PAGE_SIZE = 10;
const STATUSES: JobStatus[] = ["Requested", "Accepted", "In Progress", "Completed"];

export default function History() {
  const isCustomer = getSession()?.role === "customer";

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

  function pickStatus(s: JobStatus | "") {
    setStatus(s);
    setOffset(0);
  }

  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + PAGE_SIZE, total);

  return (
    <main className="page">
      <div className="page-head">
        <h1>{isCustomer ? "Request history" : "Job history"}</h1>
        <p className="muted">
          {isCustomer ? "Everything you have requested so far." : "Every job you have taken on."}
        </p>
      </div>

      <div className="toolbar">
        <div className="filters">
          <button type="button" className={`pill${status === "" ? " on" : ""}`} onClick={() => pickStatus("")}>
            All
          </button>
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              className={`pill${status === s ? " on" : ""}`}
              onClick={() => pickStatus(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <select
          className="sort-select"
          value={sort}
          onChange={(e) => { setSort(e.target.value as "newest" | "oldest"); setOffset(0); }}
          aria-label="Sort order"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {loading && <p className="muted">Loading...</p>}
      {error && (
        <p className="error">
          {error} <button className="link-btn" onClick={load}>Retry</button>
        </p>
      )}

      {!loading && !error && total === 0 && (
        <div className="empty">
          {status
            ? `No ${isCustomer ? "requests" : "jobs"} with status "${status}".`
            : isCustomer
              ? "You haven't sent any requests yet."
              : "You haven't taken any jobs yet."}
        </div>
      )}

      {!loading && !error && isCustomer && (
        <ul className="list">
          {customerItems.map((r) => (
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

      {!loading && !error && !isCustomer && (
        <ul className="list">
          {providerItems.map((j) => (
            <li key={j.job_id} className="item">
              <div className="item-head">
                <strong>{j.category_name ?? "General"}</strong>
                <StatusBadge status={j.status} />
              </div>
              <p>{j.description}</p>
              <small className="muted">
                {j.customer_name} · updated {new Date(j.updated_at).toLocaleDateString()}
              </small>
              {j.rating !== null && (
                <div className="item-actions">
                  <Stars value={j.rating} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {total > PAGE_SIZE && (
        <div className="pager">
          <button className="btn-outline btn-sm" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}>
            Previous
          </button>
          <span className="muted">{from} to {to} of {total}</span>
          <button className="btn-outline btn-sm" disabled={to >= total} onClick={() => setOffset(offset + PAGE_SIZE)}>
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