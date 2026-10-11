import { Order } from '@/types/api'
import { useState } from 'react'
import TicketCard from './TicketCard'
import Skeleton from '../ui/Skeleton'

type View = 'upcoming' | 'past'

const TicketsTab = ({ orders, failed, onOrderUpdate }: { orders: Order[] | null, failed: boolean, onOrderUpdate: (order: Order) => void }) => {
    const [view, setView] = useState<View>('upcoming')

    if (failed) return <p className='text-body-m text-muted'>Couldn't load your tickets. Please try again.</p>
    if (!orders) return (
        <div role='status' aria-label='Loading tickets' className='flex flex-col gap-6'>
            <Skeleton className='h-9 w-56 rounded-full' />
            {[0, 1].map((i) => (
                <Skeleton key={i} className='h-44 w-full rounded-[26px]' />
            ))}
        </div>
    )

    const upcoming = orders.filter((o) => o.isUpcoming)
    const past = orders.filter((o) => !o.isUpcoming)
    const shown = view === 'upcoming' ? upcoming : past

    return (
        <div className='flex flex-col gap-5'>
            <div className='self-start bg-card rounded-xl p-1.25 text-label-m'>
                <button onClick={() => setView('upcoming')} className={`cursor-pointer px-3.5 py-1.75 rounded-[10px] ${view === 'upcoming' ? 'text-fg bg-elevated' : 'text-muted'}`}>Upcoming <span className={`ml-2 ${view === 'upcoming' ? 'text-fg' : 'text-subtle'}`}>{upcoming.length}</span></button>
                <button onClick={() => setView('past')} className={`cursor-pointer px-3.5 py-1.75 rounded-[10px] ${view === 'past' ? 'text-fg bg-elevated' : 'text-muted'}`}>Past <span className={`ml-2 ${view === 'past' ? 'text-fg' : 'text-subtle'}`}>{past.length}</span></button>
            </div>

            <div className='flex flex-col gap-5'>
                {shown.length === 0 ? (
                    <p className='text-body-m text-muted'>No {view} tickets.</p>
                ) : (
                    shown.map((order) => (
                        <TicketCard key={order.id} order={order} onUpdate={onOrderUpdate} />
                    ))
                )}
            </div>
        </div>
    )
}

export default TicketsTab