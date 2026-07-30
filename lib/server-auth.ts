"use server";

import { cookies } from "next/headers";

/**
 * Get the auth token from cookies in server components.
 * Returns the token string or null if not authenticated.
 */
export async function getServerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("jt_token")?.value ?? null;
}

/**
 * Build authorization headers for server-side API calls.
 * Returns an object with the Authorization header if a token exists.
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getServerToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
