'use client'
import { useEffect, useState } from 'react'
import { ApiError } from '@/lib/api/errors'
import { getMovie, notifyMovie } from '@/lib/api/movies'
import { useAuth } from '@/providers/AuthProvider'
import { Loader } from 'lucide-react'

const NotifyButton = ({ slug, initialNotified }: { slug: string; initialNotified: boolean }) => {
    const [done, setDone] = useState(initialNotified)
    const [sending, setSending] = useState(false)
    const { requireAuth, status } = useAuth()

    useEffect(() => {
        if (status === 'guest') setDone(false)
        if (status !== 'authed') return
        getMovie(slug)
            .then((m) => { if (m.isNotified) setDone(true) })
            .catch(() => { })
    }, [status, slug])

    const onClick = () =>
        requireAuth(async () => {
            setSending(true)
            try {
                await notifyMovie(slug)
                setDone(true)
            } catch (e) {
                if (e instanceof ApiError && e.status === 401) throw e
            } finally {
                setSending(false)
            }
        })

    return (
        <button
            type='button'
            onClick={onClick}
            disabled={sending || done}
            className={`self-start text-label-s rounded-full px-3 py-1.5 flex gap-1 items-center border text-fg ${done ? 'bg-fg/10 cursor-default border-transparent' : 'hover:bg-fg/10 border-muted'}`}>
            {sending ?
                <Loader size={16} className='animate-spin' /> : <img src={`${done ? 'checked.svg' : '/notify.svg'}`} alt='' aria-hidden='true' className='w-4 h-4 shrink-0'/>
            }
            {done ? 'Reminder set' : 'Notify Me'}
        </button>
    )
}

export default NotifyButton