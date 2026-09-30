import type { Role, Session, User } from "../types";
import { SESSION_KEY, loadDb, newId, saveDb } from "./storage";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
}

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

function setSession(session: Session): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getCurrentUser(): User | null {
  const session = getSession();
  if (!session) return null;
  return loadDb().users.find((u) => u.id === session.userId) ?? null;
}

export function login(email: string, password: string): Session {
  const db = loadDb();
  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );
  if (!user || user.password !== password) {
    throw new Error("Invalid email or password");
  }
  const session: Session = { userId: user.id, role: user.role };
  setSession(session);
  return session;
}

export function register(input: RegisterInput): Session {
  const db = loadDb();
  const email = input.email.trim().toLowerCase();

  if (db.users.some((u) => u.email.toLowerCase() === email)) {
    throw new Error("An account with this email already exists");
  }

  const user: User = {
    id: newId("u"),
    name: input.name.trim(),
    email,
    password: input.password,
    role: input.role,
    phone: input.phone,
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);

  // Providers start with an empty profile they complete later (Module 4)
  if (input.role === "provider") {
    db.providers.push({
      id: newId("p"),
      userId: user.id,
      bio: "",
      skills: [],
      categoryIds: [],
      serviceArea: "",
      availability: "",
      rating: 0,
    });
  }

  saveDb(db);
  const session: Session = { userId: user.id, role: user.role };
  setSession(session);
  return session;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}
