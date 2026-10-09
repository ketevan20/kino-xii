'use client'
import Link from 'next/link'
import { useAuth } from '@/providers/AuthProvider'
import { getTickets } from '@/lib/api/tickets'
import { useEffect, useState } from 'react'
import { Order } from '@/types/api'

type Tab = 'profile' | 'tickets'

const tabs: { id: Tab; label: string; href: string }[] = [
    { id: 'profile', label: 'Personal Information', href: '/profile' },
    { id: 'tickets', label: 'My Tickets', href: '/profile?tab=tickets' },
]

const ProfileView = ({ tab }: { tab: Tab }) => {
    const { user } = useAuth()

    const [orders, setOrders] = useState<Order[] | null>(null)

    useEffect(() => {
        let ignore = false
        getTickets()
            .then((data) => {
                console.log(data)
                if (!ignore) setOrders(data)
            })
            .catch(() => {
            })
        return () => {
            ignore = true
        }
    }, [])

    const count = orders ? orders.filter((o) => o.isUpcoming).length : null

    if (!user) return null

    return (
        <div className='mt-[117.5px] px-12.75 mb-[118.5px] flex flex-col gap-10.5'>
            <div className='flex flex-col gap-7 border-b border-elevated'>
                <h1 className='text-h1 text-fg'>My Profile</h1>

                <nav className='flex gap-8'>
                    {tabs.map((t) => (
                        <Link
                            key={t.id}
                            href={t.href}
                            scroll={false}
                            aria-current={t.id === tab ? 'page' : undefined}
                            className={`flex flex-col gap-3.5 text-label-m ${t.id === tab ? 'text-fg' : 'text-muted hover:text-fg'}`}
                        >
                            <div>
                                {t.label}
                                {t.id === 'tickets' && count !== null && count > 0 && (
                                    <span className='ml-2 rounded-full bg-brand px-2 py-0.5 text-label-s text-fg'>{count}</span>
                                )}
                            </div>
                            <div className={`h-0.5 w-full rounded-t-xs ${t.id === tab ? 'bg-brand' : ''}`}></div>
                        </Link>
                    ))}
                </nav>
            </div>

            {tab === 'profile' ? <p>ProfileForm</p> : <p>TicketsTab</p>}
        </div>
    )
}

export default ProfileView