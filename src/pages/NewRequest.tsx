import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Category } from "../types";
import { getCategories } from "../services/categoryService";
import { createRequest } from "../services/requestService";
import { uploadPhoto } from "../services/cloudinary";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB

export default function NewRequest() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
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
    <main className="page">
      <Link to="/customer">Back to dashboard</Link>
      <h1>New service request</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Category
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Choose a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Describe the problem
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>

        <label>
          Location
          <input value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>

        <label>
          Photo (optional)
          <input type="file" accept="image/*" onChange={handlePhoto} />
        </label>

        {preview && (
          <div>
            <img
              src={preview}
              alt="Preview"
              style={{ width: 120, height: 120, objectFit: "cover" }}
            />
            <br />
            <button type="button" onClick={removePhoto}>
              Remove photo
            </button>
          </div>
        )}

        {error && <p>{error}</p>}
        <button type="submit" disabled={sending}>
          {sending ? "Sending..." : "Send request"}
        </button>
      </form>
    </main>
  );
}