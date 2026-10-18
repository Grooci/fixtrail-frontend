import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export type AuthVariant = "customer" | "provider";

const COPY: Record<AuthVariant, { title: string; text: string }> = {
  customer: {
    title: "Get it fixed, without the guesswork.",
    text: "Describe the problem, compare trusted local providers, and follow the job from request to completion.",
  },
  provider: {
    title: "Grow your business with steady local work.",
    text: "Set up your profile, choose the jobs that suit you, and build your reputation through honest reviews.",
  },
};

export default function AuthLayout({
  variant,
  children,
}: {
  variant: AuthVariant;
  children: ReactNode;
}) {
  const copy = COPY[variant];
  return (
    <main className="auth-shell">
      <section
        className="auth-visual"
        style={{ backgroundImage: `url(/images/auth-${variant}.jpg)` }}
      >
        <Link to="/" className="auth-brand">FixTrail</Link>
        <h2>{copy.title}</h2>
        <p>{copy.text}</p>
      </section>
      <section className="auth-main">
        <div className="auth-form">{children}</div>
      </section>
    </main>
  );
}