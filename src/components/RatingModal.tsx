import { useState } from "react";
import { reviewService } from "../services/reviewService";

interface Props {
  jobId: string;
  providerName: string | null;
  onClose: () => void;
  onSubmitted: () => void;
}

export default function RatingModal({ jobId, providerName, onClose, onSubmitted }: Props) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (rating === 0) {
      setError("Please choose a star rating.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await reviewService.create(jobId, rating, comment.trim());
      onSubmitted();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not submit review.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 12, padding: 24, width: "min(420px, 92vw)" }}
      >
        <h3 style={{ marginTop: 0 }}>Rate {providerName ?? "this provider"}</h3>

        <div style={{ display: "flex", gap: 6, fontSize: 32, margin: "12px 0" }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              style={{
                background: "none", border: "none", cursor: "pointer", padding: 0,
                color: n <= (hover || rating) ? "#f5a623" : "#ccc",
              }}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={1000}
          rows={4}
          placeholder="Tell others how the job went (optional)"
          style={{ width: "100%", boxSizing: "border-box" }}
        />

        {error && <p style={{ color: "#c0392b" }}>{error}</p>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
          <button type="button" onClick={onClose} disabled={submitting}>Cancel</button>
          <button type="button" onClick={submit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit review"}
          </button>
        </div>
      </div>
    </div>
  );
}