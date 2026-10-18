import { api } from "./apiClient";
import type { CustomerHistory, JobStatus, ProviderHistory } from "../types";

function qs(status?: JobStatus | "", sort = "newest", limit = 20, offset = 0) {
  const p = new URLSearchParams({ sort, limit: String(limit), offset: String(offset) });
  if (status) p.set("status", status);
  return p.toString();
}

export const historyService = {
  customer: (status?: JobStatus | "", sort = "newest", limit = 20, offset = 0) =>
    api<CustomerHistory>(`/history/customer?${qs(status, sort, limit, offset)}`),
  provider: (status?: JobStatus | "", sort = "newest", limit = 20, offset = 0) =>
    api<ProviderHistory>(`/history/provider?${qs(status, sort, limit, offset)}`),
};