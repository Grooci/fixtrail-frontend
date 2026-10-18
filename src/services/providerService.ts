import { api } from "./apiClient";

export interface PublicProvider {
  id: string;
  name: string;
  bio: string | null;
  service_area: string | null;
  is_available: boolean;
  average_rating: number;
  total_reviews: number;
  categories: string[];
}

export function getProviders(categoryId?: string): Promise<PublicProvider[]> {
  const qs = categoryId ? `?category_id=${encodeURIComponent(categoryId)}` : "";
  return api<PublicProvider[]>(`/providers${qs}`);
}

export type JobStatus =
  | "Requested"
  | "Accepted"
  | "In Progress"
  | "Completed"
  | "Declined"
  | "Cancelled";

// An open request a provider can accept or decline.
export interface OpenRequest {
  id: string;
  description: string;
  photo_url: string | null;
  location: string | null;
  category_id: string | null;
  category_name: string | null;
  customer_name: string | null;
  created_at: string;
}

export interface ProviderJob extends OpenRequest {
  request_id: string;
  status: JobStatus;
  updated_at: string;
}

export interface CategoryOption {
  id: string;
  name: string;
}

export interface ProviderProfileData {
  id: string;
  bio: string | null;
  service_area: string | null;
  is_available: boolean;
  average_rating: number;
  categories: CategoryOption[];
}

export interface ProviderProfileInput {
  bio?: string;
  service_area?: string;
  is_available?: boolean;
  category_ids?: string[];
}

export function getOpenRequests(
  filters: { categoryId?: string; location?: string } = {}
): Promise<OpenRequest[]> {
  const params = new URLSearchParams();
  if (filters.categoryId) params.set("category_id", filters.categoryId);
  if (filters.location) params.set("location", filters.location);
  const qs = params.toString();
  return api<OpenRequest[]>(`/provider/requests${qs ? `?${qs}` : ""}`);
}

export function acceptRequest(requestId: string): Promise<ProviderJob> {
  return api<ProviderJob>(`/provider/requests/${requestId}/accept`, {
    method: "POST",
  });
}

export function declineRequest(requestId: string): Promise<{ detail: string }> {
  return api<{ detail: string }>(`/provider/requests/${requestId}/decline`, {
    method: "POST",
  });
}

export function getMyJobs(): Promise<ProviderJob[]> {
  return api<ProviderJob[]>("/provider/jobs");
}

export function updateJobStatus(
  jobId: string,
  status: JobStatus
): Promise<ProviderJob> {
  return api<ProviderJob>(`/provider/jobs/${jobId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function getCategoryOptions(): Promise<CategoryOption[]> {
  return api<CategoryOption[]>("/categories");
}

export function getProviderProfile(): Promise<ProviderProfileData> {
  return api<ProviderProfileData>("/provider/profile");
}

export function saveProviderProfile(
  data: ProviderProfileInput
): Promise<ProviderProfileData> {
  return api<ProviderProfileData>("/provider/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}