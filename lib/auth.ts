import { cookies } from "next/headers";
import crypto from "node:crypto";
import { getDb, type User } from "./db";

const COOKIE = "mt_session";

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const check = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return expected.length === check.length && crypto.timingSafeEqual(expected, check);
}

export async function createSession(userId: number) {
  const token = crypto.randomBytes(32).toString("hex");
  getDb().prepare("INSERT INTO sessions (token, user_id) VALUES (?, ?)").run(token, userId);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) getDb().prepare("DELETE FROM sessions WHERE token = ?").run(token);
  store.delete(COOKIE);
}

export async function getCurrentUser(): Promise<Omit<User, "password"> | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const user = getDb()
    .prepare(
      "SELECT u.id, u.email, u.name FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?"
    )
    .get(token) as Omit<User, "password"> | undefined;
  return user ?? null;
}
