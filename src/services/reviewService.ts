import { api } from "./apiClient";
import type { ApiReview, ProviderReviews } from "../types";

export const reviewService = {
  create: (job_id: string, rating: number, comment?: string) =>
    api<ApiReview>("/reviews", {
      method: "POST",
      body: JSON.stringify({ job_id, rating, comment: comment || null }),
    }),
  forProvider: (providerId: string) =>
    api<ProviderReviews>(`/reviews/provider/${providerId}`),
};