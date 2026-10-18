import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Category } from "../types";
import { getCategories } from "../services/categoryService";

type CategoryItem = Category & { description?: string | null };

export default function Categories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page">
      <div className="page-head">
        <h1>Services</h1>
        <p className="muted">Choose a category to start a request.</p>
      </div>

      {loading && <p className="muted">Loading categories...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && categories.length === 0 && (
        <div className="empty">No categories yet.</div>
      )}

      <div className="cat-grid">
        {categories.map((c) => (
          <Link key={c.id} to={`/requests/new?category=${c.id}`} className="cat-tile">
            <span className="cat-mark">{c.name.charAt(0).toUpperCase()}</span>
            <strong>{c.name}</strong>
            <span className="muted">{c.description || "Request this service"}</span>
            <span className="cat-go">Start a request</span>
          </Link>
        ))}
      </div>
    </main>
  );
}