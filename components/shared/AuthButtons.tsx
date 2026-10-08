'use client'
import { useAuth } from '@/providers/AuthProvider'
import AccountMenu from './AccountMenu'

const AuthButtons = () => {
    const { status, openModal, logout } = useAuth()

    if (status === 'loading') return null

    if (status === 'authed') {
        return <AccountMenu />
    }
    return (
        <div className='flex gap-3'>
            <button onClick={() => openModal('register')} className='px-5.5 py-3.25 bg-brand rounded-full text-button text-fg'>Sign up</button>
            <button onClick={() => openModal('login')} className='px-5.5 py-3.25 bg-fg rounded-full text-button text-page'>Sign in</button>
        </div>
    )
}

export default AuthButtons