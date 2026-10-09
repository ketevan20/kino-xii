import { api } from './client'
import type { DataWrapper, User } from '@/types/api'

export const updateProfile = (form: FormData) =>
  api<DataWrapper<User>>('/profile', { method: 'PUT', body: form }).then((r) => r.data)