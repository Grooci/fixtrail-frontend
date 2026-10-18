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

  return (
    <main className="page">
      <div className="page-head">
        <h1>Incoming requests</h1>
        <p className="muted">Open requests in the categories you serve.</p>
      </div>

      {error && <p className="error" role="alert">{error}</p>}
      {loading && <p className="muted">Loading requests...</p>}

      {!loading && requests.length === 0 && (
        <div className="empty">
          No open requests right now. Requests only appear for the categories you chose in{" "}
          <Link to="/provider/profile">your profile</Link>.
        </div>
      )}

      <ul className="list">
        {requests.map((r) => (
          <li key={r.id} className="item request-item">
            <div className="request-body">
              <div className="item-head">
                <strong>{r.category_name ?? "Service request"}</strong>
                <span className="muted">{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
              <p>{r.description}</p>
              <small className="muted">
                {r.location ? `${r.location} · ` : ""}From {r.customer_name ?? "a customer"}
              </small>
              <div className="item-actions row">
                <button onClick={() => handleAccept(r.id)} disabled={busyId === r.id}>
                  Accept
                </button>
                <button
                  className="btn-outline"
                  onClick={() => handleDecline(r.id)}
                  disabled={busyId === r.id}
                >
                  Decline
                </button>
              </div>
            </div>
            {r.photo_url && <img src={r.photo_url} alt="Request" className="thumb" />}
          </li>
        ))}
      </ul>
    </main>
  );
}
