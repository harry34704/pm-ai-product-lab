import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { compare, hash } from "bcryptjs";
import { db } from "./db";

import { getAuthSecret, getSessionCookieConfig } from "./config";

function sign(payload: string) {
  return createHmac("sha256", getAuthSecret()).update(payload).digest("hex");
}

export async function hashPassword(password: string) {
  return hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}

export function createSessionToken(userId: string) {
  const timestamp = Date.now().toString();
  const payload = `${userId}.${timestamp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null) {
  if (!token) {
    return null;
  }

  const [userId, timestamp, signature] = token.split(".");

  if (!userId || !timestamp || !signature) {
    return null;
  }

  const expected = sign(`${userId}.${timestamp}`);

  const valid =
    signature.length === expected.length &&
    timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

  if (!valid) {
    return null;
  }

  const issuedAt = Number(timestamp);
  const { ttlSeconds } = getSessionCookieConfig();

  if (!Number.isFinite(issuedAt)) {
    return null;
  }

  if (Date.now() - issuedAt > ttlSeconds * 1000) {
    return null;
  }

  return { userId };
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieConfig().name)?.value;
  const session = verifySessionToken(token);

  if (!session) {
    return null;
  }

  return db.user.findUnique({
    where: { id: session.userId },
    include: {
      profile: true,
      settings: true
    }
  });
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}

export async function requirePageUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function setSessionCookie(userId: string) {
  const cookieStore = await cookies();
  const cookie = getSessionCookieConfig();
  cookieStore.set(cookie.name, createSessionToken(userId), cookie.options);
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  const cookie = getSessionCookieConfig();
  cookieStore.set(cookie.name, "", {
    ...cookie.options,
    maxAge: 0
  });
}
