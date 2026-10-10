'use client'

import { BOOKING_PARAM, useBookingRouter } from "@/lib/hooks/useBookingRouter"
import { useAuth } from "@/providers/AuthProvider"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import BookingDialog from "../booking/BookingDialog"

const BookingModal = () => {
    const router = useRouter()
    const { status, user, openModal } = useAuth()
    const { close } = useBookingRouter()

    const raw = useSearchParams().get(BOOKING_PARAM)
    const sessionId = raw && /^\d+$/.test(raw) ? Number(raw) : null

    useEffect(() => {
        if (sessionId !== null && status === 'guest') openModal('login')
    }, [sessionId, status, openModal])

    useEffect(() => {
        if (sessionId !== null && status === 'authed' && user && !user.profileComplete) {
            router.replace('/profile')
        }
    }, [sessionId, status, user, router])

    if (sessionId === null || status !== 'authed' || !user?.profileComplete) return null

    return <BookingDialog key={sessionId} sessionId={sessionId} onClose={close} />
}

export default BookingModal