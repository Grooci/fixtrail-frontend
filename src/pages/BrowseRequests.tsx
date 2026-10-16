import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  acceptRequest,
  declineRequest,
  getOpenRequests,
  type OpenRequest,
} from "../services/providerService";

export default function BrowseRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<OpenRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    getOpenRequests()
      .then(setRequests)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  async function handleAccept(id: string) {
    setBusyId(id);
    setError("");
    try {
      await acceptRequest(id);
      navigate("/provider/jobs");
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      // another provider may have taken it first: remove it from the list
      if (message.includes("already taken")) {
        setRequests((prev) => prev.filter((r) => r.id !== id));
      }
    } finally {
      setBusyId(null);
    }
  }

  async function handleDecline(id: string) {
    setBusyId(id);
    setError("");
    try {
      await declineRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p>Loading requests...</p>;

  return (
    <main className="page">
      <Link to="/provider">Back to dashboard</Link>
      <h1>Incoming requests</h1>

      {error && <p role="alert">{error}</p>}

      {requests.length === 0 ? (
        <p className="muted">
          No open requests right now. Requests only appear for the categories you
          chose in <Link to="/provider/profile">your profile</Link>.
        </p>
      ) : (
        <ul>
          {requests.map((r) => (
            <li key={r.id} className="card">
              <strong>{r.category_name ?? "Service request"}</strong>
              <div>{r.description}</div>
              <div>Location: {r.location ?? "Not given"}</div>
              <div className="muted">
                From {r.customer_name ?? "a customer"} ·{" "}
                {new Date(r.created_at).toLocaleString()}
              </div>
              {r.photo_url && (
                <img
                  src={r.photo_url}
                  alt="Request photo"
                  style={{ width: 80, height: 80, objectFit: "cover" }}
                />
              )}
              <div>
                <button
                  onClick={() => handleAccept(r.id)}
                  disabled={busyId === r.id}
                >
                  Accept
                </button>{" "}
                <button
                  onClick={() => handleDecline(r.id)}
                  disabled={busyId === r.id}
                >
                  Decline
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
