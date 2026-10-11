const BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");
  const isForm = options.body instanceof URLSearchParams;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const detail = Array.isArray(err.detail) ? err.detail[0]?.msg : err.detail;
    throw new Error(detail ?? `Request failed (${res.status})`);
  }
  return res.json();
}