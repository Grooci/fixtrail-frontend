import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyRequests, type ServiceRequestItem } from "../services/requestService";

export default function MyRequests() {
  const [requests, setRequests] = useState<ServiceRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyRequests()
      .then(setRequests)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading requests...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main className="page">
      <Link to="/customer">Back to dashboard</Link>
      <h1>My requests</h1>

      {requests.length === 0 ? (
        <p>You haven't sent any requests yet.</p>
      ) : (
        <ul>
          {requests.map((r) => (
            <li key={r.id}>
              <strong>{r.category_name ?? "Service request"}</strong>
              <div>{r.description}</div>
              <div>Status: {r.status}</div>
              {r.provider_name && (
                <div>
                  Provider: {r.provider_name}
                  {r.provider_phone ? ` (${r.provider_phone})` : ""}
                </div>
              )}
              <div>Location: {r.location}</div>
              <div className="muted">
                Sent {new Date(r.created_at).toLocaleString()}
              </div>
              {r.photo_url && (
                <img
                  src={r.photo_url}
                  alt="Request photo"
                  style={{ width: 80, height: 80, objectFit: "cover" }}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
