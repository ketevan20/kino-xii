import { api } from './client'
import type { DataWrapper, Order } from '@/types/api'

// no filter: both tabs in one response, newest session first
export const getTickets = () =>
  api<DataWrapper<Order[]>>('/tickets').then((r) => r.data)

// the path takes the order REFERENCE (e.g. KX-7QF2LD), not the numeric id
export const refundOrder = (reference: string) =>
  api<DataWrapper<Order>>(`/orders/${reference}/refund`, { method: 'POST' }).then((r) => r.data)