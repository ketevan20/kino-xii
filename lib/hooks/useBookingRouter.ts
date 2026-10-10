'use client'
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'

export const BOOKING_PARAM = 'booking'

export function useBookingRouter() {
    const router = useRouter()

    const open = useCallback(
        (sessionId: number) => {
            const params = new URLSearchParams(window.location.search)
            params.set(BOOKING_PARAM, String(sessionId))
            router.push(`${window.location.pathname}?${params}`, { scroll: false })
        },
        [router]
    )

    const close = useCallback(() => {
        const params = new URLSearchParams(window.location.search)
        params.delete(BOOKING_PARAM)
        const qs = params.toString()
        router.replace(qs ? `${window.location.pathname}?${qs}` : window.location.pathname, {
            scroll: false,
        })
    }, [router])

    return { open, close }
}