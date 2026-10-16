import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getMyJobs,
  updateJobStatus,
  type JobStatus,
  type ProviderJob,
} from "../services/providerService";

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

  if (loading) return <p>Loading jobs...</p>;

  return (
    <main className="page">
      <Link to="/provider">Back to dashboard</Link>
      <h1>My jobs</h1>

      {error && <p role="alert">{error}</p>}

      {jobs.length === 0 ? (
        <p className="muted">
          You have no jobs yet. <Link to="/provider/requests">Browse requests</Link>
        </p>
      ) : (
        <ul>
          {jobs.map((job) => {
            const next = NEXT[job.status];
            return (
              <li key={job.id} className="card">
                <strong>{job.category_name ?? "Service request"}</strong>
                <div>{job.description}</div>
                <div>Location: {job.location ?? "Not given"}</div>
                <div className="muted">
                  Customer: {job.customer_name ?? "Unknown"}
                </div>

                <div>
                  {STEPS.map((step, i) => (
                    <span
                      key={step}
                      style={{
                        fontWeight: step === job.status ? "bold" : "normal",
                        opacity:
                          STEPS.indexOf(job.status) >= i ? 1 : 0.4,
                      }}
                    >
                      {i > 0 && " → "}
                      {step}
                    </span>
                  ))}
                </div>

                {next && (
                  <button
                    onClick={() => handleNext(job)}
                    disabled={busyId === job.id}
                  >
                    {next.label}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
