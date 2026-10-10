import { api } from './client'
import type { DataWrapper, SeatHold, TicketSlug } from '@/types/api'

export type HoldSeatInput = { seatId: number; ticketType: TicketSlug }

export const createHold = (sessionId: number, seats: HoldSeatInput[]) =>
    api<DataWrapper<SeatHold>>(`/sessions/${sessionId}/holds`, {
        method: 'POST',
        body: JSON.stringify({ seats }),
    }).then((r) => r.data)

export const releaseHold = (holdId: string) =>
    api<null>(`/holds/${holdId}`, { method: 'DELETE', skipAuthHandler: true })