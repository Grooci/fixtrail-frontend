import type { Provider } from "../types";
import { loadDb } from "./storage";

export interface ProviderWithName extends Provider {
  name: string;
}

export async function getProviders(): Promise<ProviderWithName[]> {
  const db = loadDb();
  return db.providers.map((p) => ({
    ...p,
    name: db.users.find((u) => u.id === p.userId)?.name ?? "Unknown provider",
  }));
  // later: return api<ProviderWithName[]>("/providers");
}