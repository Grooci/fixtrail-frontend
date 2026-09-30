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
