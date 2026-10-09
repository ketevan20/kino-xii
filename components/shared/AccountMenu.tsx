import { useAuth } from '@/providers/AuthProvider'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const AccountMenu = () => {
    const { user, logout } = useAuth()
    const [open, setOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return

        const onPointerDown = (e: MouseEvent) => {
            if (!menuRef.current?.contains(e.target as Node)) setOpen(false)
        }
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false)
        }

        document.addEventListener('mousedown', onPointerDown)
        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('mousedown', onPointerDown)
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [open])

    const renderAvatar = () => {
        return (
            <div className='relative w-10.5 h-10.5'>
                {user?.avatar ? (
                    <Image
                        src={user.avatar}
                        alt="Account avatar"
                        width={42}
                        height={42}
                        className="shrink-0 h-full object-cover rounded-lg"
                    />
                ) :
                    <div className='w-10.5 h-10.5 shrin-0 flex items-center justify-center rounded-lg bg-card text-fg text-label-s uppercase'>
                        {user?.fullName ? `${user.fullName.split(" ")[0][0]} ${user.fullName.split(" ")[1][0]}` : user?.username[0]}
                    </div>
                }
                <span className={`absolute w-2 h-2 rounded-full right-0 bottom-0 border border-page ${user?.profileComplete ? 'bg-success' : 'bg-warning'}`}></span>
            </div>
        )
    }

    const PageLinks = (link: string, icon: string, label: string) => {
        return (
            <Link
                href={link}
                onClick={() => setOpen(false)}
                className='flex gap-2 items-center px-5 py-3 text-label-m text-fg hover:bg-card'
            >
                <img src={icon} alt="" />
                <p>{label}</p>
            </Link>
        )
    }

    return (
        <div ref={menuRef} className='relative'>
            <button
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-haspopup='menu'
                className='flex gap-3 items-center cursor-pointer'>
                {renderAvatar()}
                <p className='text-label-m text-fg'>{user?.username}</p>
                <img src="/arrow-down.svg" alt="arrow down icon" className={`ml-3 transition duration-300 ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className='absolute -bottom-3 translate-y-full right-0 bg-page rounded-2xl border border-elevated'>
                    <div className='px-5 flex flex-col gap-4'>
                        <div className='mt-5 flex gap-2.5 items-center'>
                            {renderAvatar()}
                            <div className='flex flex-col gap-0.5'>
                                <p className='text-fg text-label-m'>{user?.fullName ? user.fullName : user?.username}</p>
                                <p className='text-muted text-body-s'>{user?.email}</p>
                            </div>
                        </div>
                        <div className={`w-65.5 py-2.5 px-3 rounded-[10px] ${user?.profileComplete ? 'bg-success/10' : 'bg-warning/10'}`}>
                            {
                                !user?.profileComplete ?
                                    <div>
                                        <p className='text-label-m text-warning mb-0.5'>Profile Incomplete</p>
                                        <p className='text-body-s text-muted'>Please complete your profile to enable booking</p>
                                    </div>
                                    :
                                    <div className='flex gap-1.5 items-center'>
                                        <p className='text-label-m text-success mb-0.5'>Profile Complete</p>
                                        <img src={'/success.svg'} className='size-4' />
                                    </div>
                            }
                        </div>
                    </div>
                    <div className='mt-1 mb-2.5'>
                        <div className='flex flex-col gap-0.5'>
                            {PageLinks('/profile', '/profile.svg', 'Profile')}
                            {PageLinks('/profile?tab=tickets', '/ticket.svg', 'My Tickets')}
                        </div>
                        <hr className='text-fg/10 w-full my-1' />
                        <button
                            onClick={() => {
                                setOpen(false)
                                logout()
                            }}
                            className='flex gap-2 items-center w-full px-5 py-3 text-label-m text-brand hover:bg-card text-left'
                        >
                            <img src="/logout.svg" alt="" />
                            Log out
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AccountMenu