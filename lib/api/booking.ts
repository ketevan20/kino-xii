import { api } from './client'
import type { DataWrapper, Order, SeatHold, TicketSlug } from '@/types/api'

export type HoldSeatInput = { seatId: number; ticketType: TicketSlug }

export type OrderInput = {
    holdId: string
    fullName: string
    email: string
    mobileNumber: string
    cardNumber: string
    expiry: string
    cvv: string
}

export const createHold = (sessionId: number, seats: HoldSeatInput[]) =>
    api<DataWrapper<SeatHold>>(`/sessions/${sessionId}/holds`, {
        method: 'POST',
        body: JSON.stringify({ seats }),
    }).then((r) => r.data)

export const releaseHold = (holdId: string) =>
    api<null>(`/holds/${holdId}`, { method: 'DELETE', skipAuthHandler: true })

export const createOrder = (input: OrderInput) =>
    api<DataWrapper<Order>>('/orders', { method: 'POST', body: JSON.stringify(input) }).then(
        (r) => r.data
    )