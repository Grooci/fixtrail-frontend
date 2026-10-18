import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getMyJobs,
  updateJobStatus,
  type JobStatus,
  type ProviderJob,
} from "../services/providerService";
import StatusBadge from "../components/StatusBadge";

const STEPS: JobStatus[] = ["Accepted", "In Progress", "Completed"];

// What the provider can do next from each status.
const NEXT: Partial<Record<JobStatus, { status: JobStatus; label: string }>> = {
  Accepted: { status: "In Progress", label: "Start job" },
  "In Progress": { status: "Completed", label: "Mark completed" },
};

export default function MyJobs() {
  const [jobs, setJobs] = useState<ProviderJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    getMyJobs()
      .then(setJobs)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  async function handleNext(job: ProviderJob) {
    const next = NEXT[job.status];
    if (!next) return;
    setBusyId(job.id);
    setError("");
    try {
      const updated = await updateJobStatus(job.id, next.status);
      setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="page">
      <div className="page-head">
        <h1>My jobs</h1>
        <p className="muted">Move each job forward as the work progresses.</p>
      </div>

      {error && <p className="error" role="alert">{error}</p>}
      {loading && <p className="muted">Loading jobs...</p>}

      {!loading && jobs.length === 0 && (
        <div className="empty">
          You have no jobs yet. <Link to="/provider/requests">Browse requests</Link>
        </div>
      )}

      <ul className="list">
        {jobs.map((job) => {
          const next = NEXT[job.status];
          const stepIndex = STEPS.indexOf(job.status);
          return (
            <li key={job.id} className="item">
              <div className="item-head">
                <strong>{job.category_name ?? "Service request"}</strong>
                <StatusBadge status={job.status} />
              </div>
              <p>{job.description}</p>
              <small className="muted">
                {job.location ? `${job.location} · ` : ""}Customer: {job.customer_name ?? "Unknown"}
              </small>

              {stepIndex >= 0 && (
                <ol className="steps">
                  {STEPS.map((step, i) => (
                    <li
                      key={step}
                      className={i < stepIndex ? "done" : i === stepIndex ? "current" : ""}
                    >
                      {step}
                    </li>
                  ))}
                </ol>
              )}

              {next && (
                <div className="item-actions">
                  <button onClick={() => handleNext(job)} disabled={busyId === job.id}>
                    {next.label}
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
