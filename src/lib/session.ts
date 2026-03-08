import { auth } from "@/lib/auth";
import type { Session } from "next-auth";

export type AuthSession = Session & {
  user: { id: string; name: string; email: string; role: string };
};

export async function getSession(): Promise<AuthSession | null> {
  return (await auth()) as AuthSession | null;
}

export async function requireAuth(): Promise<AuthSession> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export async function requireAdmin(): Promise<AuthSession> {
  const session = await requireAuth();
  if (session.user.role !== "ADMIN") throw new Error("FORBIDDEN");
  return session;
}
