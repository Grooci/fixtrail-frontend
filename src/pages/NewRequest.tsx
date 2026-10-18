import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { Category } from "../types";
import { getCategories } from "../services/categoryService";
import { createRequest } from "../services/requestService";
import { uploadPhoto } from "../services/cloudinary";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB

export default function NewRequest() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState(params.get("category") ?? "");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => setError((err as Error).message));
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setError("The photo must be smaller than 5 MB.");
      return;
    }
    setPhotoFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function removePhoto() {
    setPhotoFile(null);
    setPreview("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!categoryId || !description.trim() || !location.trim()) {
      setError("Please choose a category and fill in the description and location.");
      return;
    }

    setSending(true);
    try {
      const photoUrl = photoFile ? await uploadPhoto(photoFile) : undefined;
      await createRequest({ categoryId, description, location, photoUrl });
      navigate("/requests");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="page page-narrow">
      <div className="page-head">
        <h1>New service request</h1>
        <p className="muted">
          Tell providers what needs fixing. The more detail you give, the better the responses.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card form-card">
        <label>
          Category
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Choose a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>

        <label>
          Describe the problem
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is wrong, and when did it start?"
          />
        </label>

        <label>
          Location
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Area or address"
          />
        </label>

        <div>
          <span className="field-label">Photo (optional)</span>
          {preview ? (
            <div className="photo-preview">
              <img src={preview} alt="Preview" />
              <button type="button" className="btn-outline btn-sm" onClick={removePhoto}>
                Remove photo
              </button>
            </div>
          ) : (
            <label className="upload">
              <span>Choose a photo</span>
              <small className="muted">PNG or JPG, up to 5 MB</small>
              <input type="file" accept="image/*" onChange={handlePhoto} className="sr-only" />
            </label>
          )}
        </div>

        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit" disabled={sending}>
          {sending ? "Sending..." : "Send request"}
        </button>
      </form>
    </main>
  );
}