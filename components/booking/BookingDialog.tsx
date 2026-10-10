import { ApiError } from '@/lib/api/errors';
import { getSession, getSessionSeats } from '@/lib/api/sessions';
import { useAuth } from '@/providers/AuthProvider';
import { ListSession, Seat, SeatMap as SeatMapData, SelectedSeat, TicketSlug, } from '@/types/api';
import React, { useCallback, useEffect, useState } from 'react'
import BookingHeader from './BookingHeader';
import StepTabs from './StepTabs';
import SeatMap from './SeatMap';
import { useFilterOptions } from '@/providers/FilterOptionsProvider';
import SeatSummary from './SeatSummary';

const BookingDialog = ({ sessionId, onClose }: { sessionId: number; onClose: () => void }) => {
    const { user, modal } = useAuth()
    const { maxSeatsPerOrder } = useFilterOptions()

    const [step] = useState<1 | 2>(1)
    const [session, setSession] = useState<ListSession | null>(null)
    const [selected, setSelected] = useState<SelectedSeat[]>([])
    const [error, setError] = useState('')
    const [seatMap, setSeatMap] = useState<SeatMapData | null>(null)
    const [notice, setNotice] = useState('')

    const minAge = session?.movie.ageRating.minAge ?? 0
    const tooYoung = !!session && user?.age != null && user.age < minAge

    useEffect(() => {
        let ignore = false
        getSession(sessionId)
            .then((s) => {
                if (!ignore) setSession(s)
            })
            .catch((e) => {
                if (ignore) return
                setError(
                    e instanceof ApiError && e.status === 404
                        ? 'This session does not exist.'
                        : 'Could not load this session. Please try again.'
                )
            })
        return () => {
            ignore = true
        }
    }, [sessionId])

    const loadSeats = useCallback(async () => {
        try {
            setSeatMap(await getSessionSeats(sessionId))
        } catch {
            setError('Could not load the seat map. Please try again.')
        }
    }, [sessionId])

    useEffect(() => {
        if (session && !tooYoung) loadSeats()
    }, [session, tooYoung, loadSeats])

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !modal) onClose()
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [modal, onClose])

    const toggleSeat = (seat: Seat) => {
        setNotice('')
        if (selected.some((s) => s.seat.id === seat.id)) {
            setSelected(selected.filter((s) => s.seat.id !== seat.id))
        } else if (selected.length >= maxSeatsPerOrder) {
            setNotice(`You can select up to ${maxSeatsPerOrder} seats per order.`)
        } else {
            setSelected([...selected, { seat, ticketType: 'adult' }])
        }
    }

    const removeSeat = (seatId: number) => {
        setNotice('')
        setSelected(selected.filter((s) => s.seat.id !== seatId))
    }

    const changeType = (seatId: number, ticketType: TicketSlug) => {
        setSelected(selected.map((s) => (s.seat.id === seatId ? { ...s, ticketType } : s)))
    }

    return (
        <div onClick={() => onClose()} className='fixed inset-0 z-40 flex items-center justify-center bg-[#101010]/30 p-4 backdrop-blur-xs'>
            <div onClick={(e) => e.stopPropagation()} role='dialog' className='min-w-286.5 max-w-[calc(100vw-4rem)] max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-none flex flex-col gap-8 bg-page p-8 rounded-[28px] text-fg shadow-[0_1px_4px_0_rgba(0,0,0,0.25)]'>
                <BookingHeader session={session} />

                {error ? (
                    <div className='text-brand text-button'>{error}</div>
                ) : !session ? (
                    <p className='text-body-m text-muted'>Loading…</p>
                ) : tooYoung ? (
                    <div className='text-warning text-label-m py-2 px-3.5 self-start rounded-xl bg-warning/10 flex flex-col gap-2'>
                        <p>RATING NOTE</p>
                        <p className='text-label-s'>
                            This film is rated {session.movie.ageRating.code}. You are {user?.age}, so you cannot
                            buy tickets for it.
                        </p>
                    </div>
                ) : (
                    <div className='flex gap-5'>
                        <div className='border-r border-card pr-5'>
                            <StepTabs step={step} />
                            {seatMap ? (
                                <SeatMap
                                    seatMap={seatMap}
                                    selectedIds={new Set(selected.map((s) => s.seat.id))}
                                    onToggle={toggleSeat}
                                />
                            ) : (
                                <p className='text-body-m text-muted'>Loading seats…</p>
                            )}
                        </div>

                        <SeatSummary
                            session={session}
                            selected={selected}
                            notice={notice}
                            onChangeType={changeType}
                            onRemove={removeSeat}
                            onNext={() => {
                                // next step: POST /holds
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default BookingDialog