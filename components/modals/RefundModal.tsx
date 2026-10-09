'use client'
import { useEffect } from 'react'
import type { Order } from '@/types/api'

type Props = {
    order: Order
    refunding: boolean
    error: string
    onConfirm: () => void
    onClose: () => void
}

const RefundModal = ({ order, refunding, error, onConfirm, onClose }: Props) => {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !refunding) onClose()
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [refunding, onClose])

    const seats = order.tickets.map((t) => t.seatCode).join(', ')

    return (
        <div
            onClick={() => {
                if (!refunding) onClose()
            }}
            className='fixed inset-0 z-50 flex items-center justify-center bg-[#101010]/30 p-4 backdrop-blur-xs'
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className='relative w-100 rounded-[28px] bg-page p-8 border border-elevated shadow-[0_1px_4px_0_rgba(0,0,0,0.25)]'
            >
                <div className='w-full flex justify-between'>
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-h2 text-fg'>Refund order?</h2>
                        <p className='text-muted text-body-s'>{order.reference}</p>
                    </div>
                    <button
                        type='button'
                        onClick={onClose}
                        disabled={refunding}
                        aria-label='Close'
                        className='self-start text-fg hover:text-muted disabled:opacity-40'
                    >
                        ✕
                    </button>
                </div>

                <div className='my-6 flex flex-col gap-3'>
                    <p className='text-body-m text-fg'>
                        {order.session.movie.title} · {seats}
                    </p>
                    <p className='text-body-m text-muted'>
                        Your seats will be released and the order will move to Past. This can&apos;t be undone.
                    </p>
                    {error && <p className='text-label-s text-brand'>{error}</p>}
                </div>

                <div className='flex gap-3'>
                    <button
                        type='button'
                        autoFocus
                        onClick={onClose}
                        disabled={refunding}
                        className='flex-1 rounded-full bg-fg/10 px-5.5 py-3.25 text-label-m text-fg enabled:hover:bg-muted disabled:opacity-40'
                    >
                        Keep tickets
                    </button>
                    <button
                        type='button'
                        onClick={onConfirm}
                        disabled={refunding}
                        className='flex-1 rounded-full bg-brand px-5.5 py-3.25 text-label-m text-fg disabled:opacity-60'
                    >
                        {refunding ? 'Refunding…' : 'Yes, refund'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RefundModal