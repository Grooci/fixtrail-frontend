import { useEffect, useState } from "react";
import type { Category } from "../types";
import { getCategories } from "../services/categoryService";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>{error}</p>;
  if (categories.length === 0) return <p>No categories yet.</p>;

  return (
    <div>
      <h1>Service categories</h1>
      <ul>
        {categories.map((c) => (
          <li key={c.id}>
            <span>{c.icon}</span> {c.name}
          </li>
        ))}
      </ul>
    </div>
  );
}