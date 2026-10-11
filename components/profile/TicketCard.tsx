import { Order } from '@/types/api'
import Image from 'next/image'
import { useState } from 'react'
import Badge from '../ui/Badge'
import { ApiError } from '@/lib/api/errors'
import { refundOrder } from '@/lib/api/tickets'
import RefundModal from '../modals/RefundModal'
import { formatSessionDate, msUntilStart, shiftWallClock } from '@/lib/date'

const REFUND_CUTOFF_MS = 2 * 60 * 60 * 1000

const TicketCard = ({ order, onUpdate }: { order: Order; onUpdate: (order: Order) => void }) => {
    const [confirming, setConfirming] = useState(false)
    const [refunding, setRefunding] = useState(false)
    const [error, setError] = useState('')

    const windowOpen = msUntilStart(order.session) > REFUND_CUTOFF_MS

    const refunded = order.status === 'refunded'
    const canRefund = !refunded && order.isRefundable && windowOpen

    const onRefund = async () => {
        setRefunding(true)
        setError('')
        try {
            const updated = await refundOrder(order.reference)
            onUpdate(updated)
        } catch (e) {
            setRefunding(false)
            if (e instanceof ApiError) {
                if (e.status !== 401) setError(e.message)
            } else {
                setError('Something went wrong. Please try again.')
            }
        }
    }

    const renderdetails = (label: string, text: string) => {
        return (
            <div className='flex flex-col gap-1'>
                <p className='text-muted text-overline uppercase'>{label}</p>
                <p className='text-label-m text-fg'>{text}</p>
            </div>
        )
    }

    const closeModal = () => {
        setConfirming(false)
        setError('')
    }

    return (
        <div className='w-full bg-card rounded-[26px] flex gap-4.5'>
            <div className='flex-1 px-7.5 flex gap-4.5 items-center'>
                {order.session.movie.posterUrl && (
                    <Image
                        src={order.session.movie.posterUrl}
                        width={100}
                        height={133}
                        alt='movie poster'
                        className='rounded-[10px] object-cover'
                    />
                )}
                <div className='flex-1 flex flex-col gap-3'>
                    <div className='flex gap-2.5 items-center'>
                        <p className='text-h2 text-fg uppercase'>{order.session.movie.title}</p>
                        <Badge variant='brand'>{order.session.movie.ageRating.code}</Badge>
                        <p className='text-body-m text-muted'>{order.session.movie.runtimeMinutes} min</p>
                    </div>
                    <div className='flex gap-10'>
                        {renderdetails('Date', formatSessionDate(shiftWallClock(order.session, -0)))}
                        {renderdetails('Venue', `${order.session.venue.name} · Hall ${order.session.hall.name}`)}
                        {renderdetails('format', `${order.session.format.name} · ${order.session.language.name}`)}
                    </div>
                    <div className='flex gap-2 items-center'>
                        <p className='text-muted uppercase text-overline'>Seats</p>
                        {
                            order.tickets.map(t => <Badge key={t.id} className='rounded-md!'>{t.seatCode} · {t.ticketType.name}</Badge>)
                        }
                    </div>
                </div>
            </div>

            <div className='px-6 py-5 flex flex-col gap-4 border-l border-elevated border-dashed'>
                <div>
                    <p className='text-muted uppercase text-overline'>order</p>
                    <p className='text-label-m text-fg mt-0.5'>{order.reference}</p>
                </div>
                <div className='flex flex-col gap-2.5 min-w-62.75'>
                    <div className='flex justify-between'>
                        <p className='self-end text-label-m text-muted'>Total paid</p>
                        <h1 className='text-h1 text-fg'>₾{order.totalPrice}</h1>
                    </div>
                    <button
                        type='button'
                        onClick={() => setConfirming(true)}
                        disabled={!canRefund}
                        className='text-button text-fg bg-fg/10 rounded-full px-5.5 py-2.5 enabled:hover:bg-muted enabled:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'
                    >
                        Refund
                    </button>
                    <p className='text-muted text-body-m text-center'>{order.refundedAt ? `Refunded` : `Refundable until ${formatSessionDate(shiftWallClock(order.session, -REFUND_CUTOFF_MS))}`}</p>
                </div>
            </div>
            {confirming && (
                <RefundModal
                    order={order}
                    refunding={refunding}
                    error={error}
                    onConfirm={onRefund}
                    onClose={closeModal}
                />
            )}
        </div>
    )
}

export default TicketCard