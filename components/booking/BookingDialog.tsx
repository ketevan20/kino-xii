import { ApiError } from '@/lib/api/errors';
import { getSession, getSessionSeats } from '@/lib/api/sessions';
import { useAuth } from '@/providers/AuthProvider';
import { ListSession, Seat, SeatHold, SeatMap as SeatMapData, SelectedSeat, TicketSlug, } from '@/types/api';
import { useCallback, useEffect, useRef, useState } from 'react'
import BookingHeader from './BookingHeader';
import StepTabs from './StepTabs';
import SeatMap from './SeatMap';
import { useFilterOptions } from '@/providers/FilterOptionsProvider';
import SeatSummary from './SeatSummary';
import { createHold, releaseHold } from '@/lib/api/booking';
import { markSold } from '@/lib/seatMap';
import HoldTimer from './HoldTimer';
import CheckoutStep from './CheckoutStep';

const BookingDialog = ({ sessionId, onClose }: { sessionId: number; onClose: () => void }) => {
    const { user, modal } = useAuth()
    const { maxSeatsPerOrder } = useFilterOptions()

    const [step, setStep] = useState<1 | 2>(1)
    const [hold, setHold] = useState<SeatHold | null>(null)
    const [holding, setHolding] = useState(false)
    const [banner, setBanner] = useState('')
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

    const holdRef = useRef<SeatHold | null>(null)
    useEffect(() => {
        holdRef.current = hold
    }, [hold])

    useEffect(() => {
        return () => {
            const live = holdRef.current
            if (live) releaseHold(live.holdId).catch(() => { }) 
        }
    }, [])

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

    const onHoldExpired = useCallback(() => {
        setHold(null)
        setSelected([])
        setStep(1)
        setBanner('Your hold time expired. Please re-select your seats.')
        loadSeats()
    }, [loadSeats])

    const goToCheckout = async () => {
        setHolding(true)
        setBanner('')
        try {
            const created = await createHold(
                sessionId,
                selected.map((s) => ({ seatId: s.seat.id, ticketType: s.ticketType }))
            )
            setHold(created)
            setStep(2)
        } catch (e) {
            if (!(e instanceof ApiError)) {
                setBanner('Something went wrong. Please try again.')
            } else if (e.status === 409) {
                const lost = (e.body as { contested?: string[] } | null)?.contested ?? []
                setSelected((prev) => prev.filter((s) => !lost.includes(s.seat.code)))
                setSeatMap((prev) => (prev ? markSold(prev, lost) : prev))
                setBanner(
                    lost.length
                        ? `${lost.join(', ')} ${lost.length === 1 ? 'was' : 'were'} just taken. Your other seats are still selected.`
                        : e.message
                )
                loadSeats()
            } else if (e.isFieldError) {
                setBanner(Object.values(e.errors!)[0][0])
            } else if (e.status !== 401) {
                setBanner(e.message)
            }
        } finally {
            setHolding(false)
        }
    }

    return (
        <div onClick={() => onClose()} className='fixed inset-0 z-40 flex items-center justify-center bg-[#101010]/30 p-4 backdrop-blur-xs'>
            <div onClick={(e) => e.stopPropagation()} role='dialog' className='min-w-286.5 max-w-[calc(100vw-4rem)] max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-none flex flex-col gap-8 bg-page p-8 rounded-[28px] text-fg shadow-[0_1px_4px_0_rgba(0,0,0,0.25)]'>
                <div className='flex justify-between'>
                    <BookingHeader session={session} />
                    {hold && <HoldTimer expiresAt={hold.expiresAt} onExpire={onHoldExpired} />}
                </div>

                {banner && (
                    <p role='alert' className='rounded-xl bg-card p-4 text-label-s text-brand'>
                        {banner}
                    </p>
                )}

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
                ) : step === 2 && hold ? (
                    <CheckoutStep
                        session={session}
                        hold={hold}
                        onBack={() => {
                            setBanner('')
                            setStep(1)
                        }}
                    />
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
                            loading={holding}
                            onNext={goToCheckout}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default BookingDialog