import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProviders, type ProviderWithName } from "../services/providerService";

export default function Providers() {
  const [providers, setProviders] = useState<ProviderWithName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProviders()
      .then(setProviders)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading providers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main className="page">
      <Link to="/customer">Back to dashboard</Link>
      <h1>Providers</h1>
      {providers.length === 0 ? (
        <p>No providers yet.</p>
      ) : (
        <ul>
          {providers.map((p) => (
            <li key={p.id}>
              <strong>{p.name}</strong> (rating {p.rating})
              <div>{p.bio || "No bio yet"}</div>
              <div>Area: {p.serviceArea || "Not set"}</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}