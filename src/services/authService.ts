import type { Role, Session, User } from "../types";
import { SESSION_KEY } from "./storage";
import { api } from "./apiClient";

const TOKEN_KEY = "token";
const REFRESH_KEY = "refresh_token";
const USER_KEY = "fixtrail_user";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
}

// Converts what the backend sends into the User shape the frontend uses
function toUser(u: any): User {
  return {
    id: String(u.id),
    name: u.full_name,
    email: u.email,
    role: u.role,
    phone: u.phone ?? undefined,
    createdAt: u.created_at ?? new Date().toISOString(),
  } as User;
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

// Still synchronous: reads the user we saved at login
export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export async function login(email: string, password: string): Promise<Session> {
  const form = new URLSearchParams();
  form.append("username", email.trim().toLowerCase());
  form.append("password", password);

  const tokens = await api<{ access_token: string; refresh_token: string }>(
    "/auth/login",
    { method: "POST", body: form }
  );
  localStorage.setItem(TOKEN_KEY, tokens.access_token);
  localStorage.setItem(REFRESH_KEY, tokens.refresh_token);

  const user = toUser(await api("/auth/me"));
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  const session: Session = { userId: user.id, role: user.role };
  setSession(session);
  return session;
}

export async function register(input: RegisterInput): Promise<Session> {
  await api("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      full_name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone,
      password: input.password,
      role: input.role,
    }),
  });
  // Log in right away, same as your old register did
  return login(input.email, input.password);
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}