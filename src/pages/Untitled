import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCategoryOptions,
  getProviders,
  type CategoryOption,
  type PublicProvider,
} from "../services/providerService";
import { reviewService } from "../services/reviewService";
import Stars from "../components/Stars";
import type { ApiReview } from "../types";

export default function Providers() {
  const [providers, setProviders] = useState<PublicProvider[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openId, setOpenId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Record<string, ApiReview[]>>({});
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState("");

  useEffect(() => {
    getCategoryOptions().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    getProviders(categoryId || undefined)
      .then(setProviders)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [categoryId]);

  async function toggleReviews(id: string) {
    if (openId === id) {
      setOpenId(null);
      return;
    }
    setOpenId(id);
    setReviewsError("");
    if (reviews[id]) return;
    setReviewsLoading(true);
    try {
      const res = await reviewService.forProvider(id);
      setReviews((prev) => ({ ...prev, [id]: res.reviews }));
    } catch (e) {
      setReviewsError(e instanceof Error ? e.message : "Could not load reviews.");
    } finally {
      setReviewsLoading(false);
    }
  }

  return (
    <main className="page">
      <Link to="/customer">Back to dashboard</Link>
      <h1>Providers</h1>

      <label>
        Category{" "}
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </label>

      {loading && <p>Loading providers...</p>}
      {error && <p style={{ color: "#c0392b" }}>{error}</p>}

      {!loading && !error && providers.length === 0 && <p>No providers found.</p>}

      {!loading && !error && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {providers.map((p) => (
            <li key={p.id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12, margin: "12px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <strong>{p.name}</strong>
                <span className="muted">{p.is_available ? "Available" : "Unavailable"}</span>
              </div>

              <div style={{ margin: "4px 0" }}>
                {p.total_reviews > 0 ? (
                  <>
                    <Stars value={p.average_rating} />{" "}
                    <span className="muted">
                      {p.average_rating.toFixed(1)} ({p.total_reviews} review{p.total_reviews === 1 ? "" : "s"})
                    </span>
                  </>
                ) : (
                  <span className="muted">No reviews yet</span>
                )}
              </div>

              <div>{p.bio || "No bio yet"}</div>
              <div>Area: {p.service_area || "Not set"}</div>
              {p.categories.length > 0 && (
                <div className="muted">Services: {p.categories.join(", ")}</div>
              )}

              {p.total_reviews > 0 && (
                <button style={{ marginTop: 8 }} onClick={() => toggleReviews(p.id)}>
                  {openId === p.id ? "Hide reviews" : "Show reviews"}
                </button>
              )}

              {openId === p.id && (
                <div style={{ marginTop: 8 }}>
                  {reviewsLoading && !reviews[p.id] && <p>Loading reviews...</p>}
                  {reviewsError && <p style={{ color: "#c0392b" }}>{reviewsError}</p>}
                  {reviews[p.id]?.map((r) => (
                    <div key={r.id} style={{ borderTop: "1px solid #eee", padding: "8px 0" }}>
                      <strong>{r.reviewer_name}</strong> <Stars value={r.rating} />
                      {r.comment && <p style={{ margin: "4px 0" }}>{r.comment}</p>}
                      <small className="muted">{new Date(r.created_at).toLocaleDateString()}</small>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}