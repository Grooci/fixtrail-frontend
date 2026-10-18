import { api } from "./apiClient";
import type { CustomerDashboard, ProviderDashboard } from "../types";

export const dashboardService = {
  customer: () => api<CustomerDashboard>("/dashboard/customer"),
  provider: () => api<ProviderDashboard>("/dashboard/provider"),
};