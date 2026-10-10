'use client'
import { useEffect, useState } from 'react'

const LOW_SECONDS = 60

const secondsLeft = (expiresAt: string) =>
    Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000))

const format = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

const HoldTimer = ({ expiresAt, onExpire }: { expiresAt: string; onExpire: () => void }) => {
    const [left, setLeft] = useState(() => secondsLeft(expiresAt))

    useEffect(() => {
        const tick = () => {
            const s = secondsLeft(expiresAt)
            setLeft(s)
            if (s === 0) onExpire()
        }
        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [expiresAt, onExpire])

    return (
        <div role='timer' className='rounded-xl bg-elevated px-4 py-2.5 text-center'>
            <p className='text-overline uppercase text-muted'>Seats held</p>
            <p className={`text-label-m ${left <= LOW_SECONDS ? 'text-brand' : 'text-fg'}`}>
                {format(left)}
            </p>
        </div>
    )
}

export default HoldTimer