import type { Category } from "../types";
import { api } from "./apiClient";

interface ApiCategory {
  id: string;
  name: string;
  description?: string | null;
}

export async function getCategories(): Promise<Category[]> {
  const data = await api<ApiCategory[]>("/categories");
  return data.map((c) => ({ id: c.id, name: c.name, icon: "" }));
}