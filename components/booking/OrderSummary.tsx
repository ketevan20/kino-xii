import { formatSessionDate } from '@/components/profile/TicketCard'
import { summarizeTickets } from '@/lib/tickets';
import type { ListSession, SeatHold } from '@/types/api'

const money = (n: number) => `₾${Number(n.toFixed(2))}`

const Row = ({ label, value }: { label: string; value: string }) => (
    <div className='flex justify-between gap-4 '>
        <span className='text-muted text-body-s'>{label}</span>
        <span className='text-right text-label-s text-fg'>{value}</span>
    </div>
)

const OrderSummary = ({ session, hold, canPay, paying }: { session: ListSession; hold: SeatHold; canPay: boolean; paying: boolean }) => {
    const tickets = summarizeTickets(hold.seats)

    const seats = hold.seats.map((s) => s.code).join(', ')

    const counts = hold.seats.reduce<Record<string, number>>((acc, s) => {
        acc[s.ticketType.name] = (acc[s.ticketType.name] ?? 0) + 1
        return acc
    }, {})

    return (
        <aside className='flex flex-col gap-3 border-l border-elevated pl-5'>
            <h3 className='text-label-m text-fg'>Summary</h3>

            <div className='flex flex-col gap-3 rounded-2xl bg-card p-5'>
                <p className='text-label-m uppercase text-fg'>{session.movie.title}</p>
                <p className='border-b border-elevated pb-3 text-body-s text-muted'>
                    Hall {session.hall.name} · {formatSessionDate(session)}
                </p>
                <Row label='Seats' value={seats} />
                <Row label='Tickets' value={tickets} />
            </div>

            <div className='mt-auto flex flex-col gap-4'>
                <div className='flex items-end justify-between'>
                    <span className='text-overline uppercase text-muted'>Subtotal</span>
                    <span className='text-h2 text-fg'>{money(hold.subtotal)}</span>
                </div>
                <button
                    type='submit'
                    disabled={!canPay || paying}
                    className='rounded-full bg-brand px-5.5 py-3.25 text-label-m text-fg disabled:bg-subtle disabled:text-muted'
                >
                    {paying ? 'Processing…' : 'Pay: Complete order'}
                </button>
            </div>
        </aside>
    )
}

export default OrderSummary