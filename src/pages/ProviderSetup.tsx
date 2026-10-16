import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
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

  if (loading) return <p>Loading profile...</p>;

  return (
    <main className="page">
      <Link to="/provider">Back to dashboard</Link>
      <h1>My provider profile</h1>

      <form onSubmit={handleSubmit} className="card">
        <label>
          Bio
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
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

        <label>
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
          />{" "}
          I am available for new jobs
        </label>

        <fieldset>
          <legend>Categories you serve</legend>
          {categories.map((c) => (
            <label key={c.id} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={selected.includes(c.id)}
                onChange={() => toggleCategory(c.id)}
              />{" "}
              {c.name}
            </label>
          ))}
        </fieldset>

        {error && <p role="alert">{error}</p>}
        {message && <p>{message}</p>}

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save profile"}
        </button>
      </form>
    </main>
  );
}
