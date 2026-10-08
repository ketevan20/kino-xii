import { ApiError } from "./errors";
import { getToken } from '@/lib/auth/token'

const BASE = process.env.NEXT_PUBLIC_API_URL!;

// AuthProvider registers this so a 401 can open the login modal
let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (fn: () => void) => (onUnauthorized = fn);

type Options = RequestInit & { skipAuthHandler?: boolean }

export async function api<T>(path: string, init: Options = {}): Promise<T> {
  const { skipAuthHandler, headers, body, ...rest } = init
  const token = getToken()
  const isForm = body instanceof FormData

  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    body,
    headers: {
      Accept: 'application/json',
      ...(isForm ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  })

  const data = await res.json().catch(() => null) 

  if (!res.ok) {
    if (res.status === 401 && !skipAuthHandler) onUnauthorized?.()
    throw new ApiError(res.status, data?.message ?? 'Request failed', data?.errors, data)
  }
  return data as T
}