import { api } from './client'
import type { DataWrapper, User } from '@/types/api'

export type AuthResult = { user: User; token: string }
export type LoginInput = { email: string; password: string }

export const loginRequest = (input: LoginInput) =>
  api<DataWrapper<AuthResult>>('/login', {
    method: 'POST',
    body: JSON.stringify(input),
    skipAuthHandler: true, 
  }).then((r) => r.data)

// the form must be FormData (optional avatar); do not set Content-Type yourself
export const registerRequest = (form: FormData) =>
  api<DataWrapper<AuthResult>>('/register', { method: 'POST', body: form }).then((r) => r.data)

export const getMe = () =>
  api<DataWrapper<User>>('/me', { skipAuthHandler: true }).then((r) => r.data)

export const logoutRequest = () =>
  api<null>('/logout', { method: 'POST', skipAuthHandler: true })