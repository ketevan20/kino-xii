'use client'
import { useEffect } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    const { status, openModal } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (status === 'guest') {
            openModal('login')
        }
    }, [status, openModal])

    if (status === 'authed') return <>{children}</>
    if (status === 'loading') return null

    return (
        <div className='flex h-full flex-col items-center justify-center gap-4 py-24'>
            <p className='text-body-m text-muted'>Log in to see this page.</p>
            <button
                type='button'
                onClick={() => openModal('login')}
                className='rounded-full bg-brand px-6 py-3 text-label-m text-fg c'
            >
                Log in
            </button>
        </div>
    )
}

export default RequireAuth