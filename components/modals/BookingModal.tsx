'use client'

import { BOOKING_PARAM, useBookingRouter } from "@/lib/hooks/useBookingRouter"
import { useAuth } from "@/providers/AuthProvider"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

const BookingModal = () => {
    const { status, user, openModal } = useAuth()
    const { close } = useBookingRouter()

    const raw = useSearchParams().get(BOOKING_PARAM)
    const sessionId = raw && /^\d+$/.test(raw) ? Number(raw) : null

    useEffect(() => {
        if (sessionId !== null && status === 'guest') openModal('login')
    }, [sessionId, status, openModal])

    if (sessionId === null) return null


    return (
        <div onClick={() => close()} className='fixed inset-0 z-40 flex items-center justify-center bg-[#101010]/30 p-4 backdrop-blur-xs'>
            <div onClick={(e) => e.stopPropagation()} className='w-286.5 bg-page p-8 rounded-[28px] text-fg'>
                Booking Modal
            </div>
        </div>
    )
}

export default BookingModal