import { useEffect, useState } from "react";
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
      <div className="page-head">
        <h1>Providers</h1>
        <p className="muted">Compare ratings and read what other customers said.</p>
      </div>

      <div className="filters">
        <button
          type="button"
          className={`pill${categoryId === "" ? " on" : ""}`}
          onClick={() => setCategoryId("")}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`pill${categoryId === c.id ? " on" : ""}`}
            onClick={() => setCategoryId(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {loading && <p className="muted">Loading providers...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && providers.length === 0 && (
        <div className="empty">No providers found.</div>
      )}

      {!loading && !error && (
        <ul className="list">
          {providers.map((p) => (
            <li key={p.id} className="item">
              <div className="provider-top">
                <span className="avatar">{p.name.charAt(0).toUpperCase()}</span>
                <div className="provider-id">
                  <strong>{p.name}</strong>
                  <div className="rating-line">
                    {p.total_reviews > 0 ? (
                      <>
                        <Stars value={p.average_rating} />
                        <span className="muted">
                          {p.average_rating.toFixed(1)} ({p.total_reviews} review
                          {p.total_reviews === 1 ? "" : "s"})
                        </span>
                      </>
                    ) : (
                      <span className="muted">No reviews yet</span>
                    )}
                  </div>
                </div>
                <span className={`badge${p.is_available ? " s-completed" : ""}`}>
                  {p.is_available ? "Available" : "Unavailable"}
                </span>
              </div>

              <p>{p.bio || "No bio yet"}</p>
              <small className="muted">Area: {p.service_area || "Not set"}</small>

              {p.categories.length > 0 && (
                <div className="chips">
                  {p.categories.map((name) => (
                    <span key={name} className="chip">{name}</span>
                  ))}
                </div>
              )}

              {p.total_reviews > 0 && (
                <div className="item-actions">
                  <button className="btn-outline btn-sm" onClick={() => toggleReviews(p.id)}>
                    {openId === p.id ? "Hide reviews" : "Show reviews"}
                  </button>
                </div>
              )}

              {openId === p.id && (
                <div className="reviews">
                  {reviewsLoading && !reviews[p.id] && <p className="muted">Loading reviews...</p>}
                  {reviewsError && <p className="error">{reviewsError}</p>}
                  {reviews[p.id]?.map((r) => (
                    <div key={r.id} className="review">
                      <div className="item-head">
                        <strong>{r.reviewer_name}</strong>
                        <Stars value={r.rating} />
                      </div>
                      {r.comment && <p>{r.comment}</p>}
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