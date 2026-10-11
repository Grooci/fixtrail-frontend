import { api } from "./apiClient";

export interface NewRequestInput {
  categoryId: string;
  description: string;
  location: string;
  photoUrl?: string;
}

export interface ServiceRequestItem {
  id: string;
  category_id: string | null;
  category_name: string | null;
  description: string;
  photo_url: string | null;
  location: string | null;
  status: string;
  created_at: string;
}

export function createRequest(input: NewRequestInput) {
  return api<ServiceRequestItem>("/requests", {
    method: "POST",
    body: JSON.stringify({
      category_id: input.categoryId,
      description: input.description.trim(),
      location: input.location.trim(),
      photo_url: input.photoUrl ?? null,
    }),
  });
}

export function getMyRequests() {
  return api<ServiceRequestItem[]>("/requests/mine");
}