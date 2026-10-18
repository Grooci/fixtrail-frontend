export type Role = "customer" | "provider";

export type RequestStatus =
  | "requested"
  | "accepted"
  | "in_progress"
  | "completed"
  | "declined";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // mock only: never store plain passwords in a real app
  role: Role;
  phone?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Provider {
  id: string;
  userId: string;
  bio: string;
  skills: string[];
  categoryIds: string[];
  serviceArea: string;
  availability: string;
  rating: number;
}

export interface StatusChange {
  status: RequestStatus;
  at: string;
}

export interface ServiceRequest {
  id: string;
  customerId: string;
  providerId?: string;
  categoryId: string;
  title: string;
  description: string;
  photos: string[]; // data URLs or object URLs
  location: string;
  status: RequestStatus;
  statusHistory: StatusChange[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  requestId: string;
  customerId: string;
  providerId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface Session {
  userId: string;
  role: Role;
}

export interface Database {
  users: User[];
  categories: Category[];
  providers: Provider[];
  requests: ServiceRequest[];
  reviews: Review[];
}

export interface ApiReview {
  id: string;
  job_id: string;
  reviewer_id: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export type JobStatus =
  | "Requested" | "Accepted" | "In Progress"
  | "Completed" | "Declined" | "Cancelled";

export interface RequestSummary {
  request_id: string;
  description: string;
  category_name: string | null;
  status: JobStatus;
  provider_name: string | null;
  job_id: string | null;
  has_review: boolean;
  created_at: string;
}

export interface CustomerDashboard {
  total_requests: number;
  counts: Record<JobStatus, number>;
  recent: RequestSummary[];
}

export interface ApiReview {
  id: string;
  job_id: string;
  reviewer_id: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface ProviderJobSummary {
  job_id: string;
  request_id: string;
  description: string;
  category_name: string | null;
  customer_name: string;
  location: string | null;
  status: JobStatus;
  updated_at: string;
}

export interface ProviderDashboard {
  available_requests: number;
  active_jobs: number;
  completed_jobs: number;
  average_rating: number;
  total_reviews: number;
  active: ProviderJobSummary[];
  recent_reviews: ApiReview[];
}

export interface CustomerHistory {
  total: number;
  items: RequestSummary[];
}

export interface ProviderHistoryItem {
  job_id: string;
  request_id: string;
  description: string;
  category_name: string | null;
  customer_name: string;
  status: JobStatus;
  rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProviderHistory {
  total: number;
  items: ProviderHistoryItem[];
}

export interface ProviderReviews {
  average_rating: number;
  total_reviews: number;
  reviews: ApiReview[];
}