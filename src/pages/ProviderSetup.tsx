import { useEffect, useState, type FormEvent } from "react";
import {
  getCategoryOptions,
  getProviderProfile,
  saveProviderProfile,
  type CategoryOption,
} from "../services/providerService";

export default function ProviderSetup() {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      getCategoryOptions(),
      // a brand new provider may not have a profile yet: treat that as empty
      getProviderProfile().catch(() => null),
    ])
      .then(([cats, profile]) => {
        setCategories(cats);
        if (profile) {
          setBio(profile.bio ?? "");
          setServiceArea(profile.service_area ?? "");
          setIsAvailable(profile.is_available);
          setSelected(profile.categories.map((c) => c.id));
        }
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  function toggleCategory(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await saveProviderProfile({
        bio,
        service_area: serviceArea,
        is_available: isAvailable,
        category_ids: selected,
      });
      setMessage("Profile saved.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page page-narrow">
      <div className="page-head">
        <h1>My provider profile</h1>
        <p className="muted">
          Customers see this when they browse providers. Choose the categories you serve to
          receive matching requests.
        </p>
      </div>

      {loading ? (
        <p className="muted">Loading profile...</p>
      ) : (
        <form onSubmit={handleSubmit} className="card form-card">
          <label>
            Bio
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Your experience and the kind of work you do"
            />
          </label>

          <label>
            Service area
            <input
              value={serviceArea}
              onChange={(e) => setServiceArea(e.target.value)}
              placeholder="e.g. Kampala"
            />
          </label>

          <div>
            <span className="field-label">Categories you serve</span>
            <div className="chip-group">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`chip-select${selected.includes(c.id) ? " on" : ""}`}
                  aria-pressed={selected.includes(c.id)}
                  onClick={() => toggleCategory(c.id)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <label className="check">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
            />
            I am available for new jobs
          </label>

          {error && <p className="error" role="alert">{error}</p>}
          {message && <p className="success">{message}</p>}

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save profile"}
          </button>
        </form>
      )}
    </main>
  );
}
