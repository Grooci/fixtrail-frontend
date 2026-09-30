import seed from "../data/seed.json";
import type { Database } from "../types";

export const DB_KEY = "fixtrail_db";
export const SESSION_KEY = "fixtrail_session";

// Load the mock database from localStorage, seeding it on first run.
export function loadDb(): Database {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw) as Database;
  } catch {
    // corrupted or unavailable storage: fall through and reseed
  }
  return resetDb();
}

export function saveDb(db: Database): void {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (err) {
    console.error("Could not save to localStorage", err);
  }
}

// Restore the original seed data and log everyone out.
export function resetDb(): Database {
  const fresh = structuredClone(seed) as unknown as Database;
  saveDb(fresh);
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
  return fresh;
}

// Small helper for generating ids like "r1712345678901"
export function newId(prefix: string): string {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
}
