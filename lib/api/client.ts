import { ApiError } from "./errors";

const BASE = process.env.NEXT_PUBLIC_API_URL!;

// AuthProvider registers this so a 401 can open the login modal
let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (fn: () => void) => (onUnauthorized = fn);

export async function api<T>(
  path: string,
  init: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const { token, headers, ...rest } = init;

  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401) onUnauthorized?.();
    throw new ApiError(res.status, data?.message ?? "Request failed", data?.errors, data);
  }

  return data as T;
}