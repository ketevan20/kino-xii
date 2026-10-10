'use client'
import Image from 'next/image'
import Link from 'next/link'
import { formatSessionDate } from '@/components/profile/TicketCard'
import { summarizeTickets } from '@/lib/tickets'
import type { Order } from '@/types/api'

const money = (n: number) => `₾${Number(n.toFixed(2))}`

const Row = ({ label, value, strong }: { label: string; value: string; strong?: boolean }) => (
    <div className='flex justify-between gap-4 text-label-s'>
        <span className='text-muted'>{label}</span>
        <span className={`text-right text-fg ${strong ? 'text-label-m' : ''}`}>{value}</span>
    </div>
)

const Confirmation = ({ order, onClose }: { order: Order; onClose: () => void }) => {
    const { session } = order

    return (
        <div
            onClick={onClose}
            className='fixed inset-0 z-40 flex items-center justify-center bg-[#101010]/30 p-4 backdrop-blur-xs'>
            <div
                onClick={(e) => e.stopPropagation()}
                role='dialog'
                aria-modal='true'
                aria-label='Booking confirmed'
                className='flex w-286.5 max-w-full min-h-150 flex-col items-center gap-6 rounded-[28px] border border-elevated bg-page p-8 text-fg'>
                <span className='flex size-12 items-center justify-center rounded-full bg-success'>
                    <img src={'/checked.svg'} className='size-6'/>
                </span>

                <div className=' flex flex-col items-center gap-2 text-center'>
                    <h2 className='text-h2 text-fg'>Booking confirmed!</h2>
                    <p className='text-body-s text-muted'>
                        Your tickets are ready. We've sent a confirmation to your email.
                    </p>
                    <span className='mt-2 rounded-full bg-elevated px-3 py-1 text-overline uppercase text-muted'>
                        Order #{order.reference}
                    </span>
                </div>

                <div className='flex w-full max-w-163.25 flex-col gap-4 rounded-2xl bg-card p-4'>
                    <div className='flex items-center gap-3'>
                        <div className='relative h-15 w-11 shrink-0 overflow-hidden rounded-lg bg-elevated'>
                            {session.movie.posterUrl && (
                                <Image
                                    src={session.movie.posterUrl}
                                    alt=''
                                    fill
                                    sizes='44px'
                                    className='object-cover'
                                />
                            )}
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p className='text-label-m uppercase text-fg'>{session.movie.title}</p>
                            <p className='text-body-s text-muted'>
                                {session.venue.name} · Hall {session.hall.name} · {formatSessionDate(session)}
                            </p>
                        </div>
                    </div>

                    <div className='flex flex-col gap-3 border-t border-elevated pt-4'>
                        <Row label='Seats' value={order.tickets.map((t) => t.seatCode).join(', ')} />
                        <Row label='Tickets' value={summarizeTickets(order.tickets)} />
                        <Row label='Total paid' value={money(order.totalPrice)} strong />
                    </div>
                </div>

                <div className='flex gap-3'>
                    <Link
                        href='/profile?tab=tickets'
                        className='rounded-full bg-brand px-5.5 py-2.5 text-button text-fg'
                    >
                        View my tickets
                    </Link>
                    <Link
                        href='/'
                        className='rounded-full bg-fg/10 px-5.5 py-2.5 text-button text-fg hover:bg-muted'
                    >
                        Back to home
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Confirmation