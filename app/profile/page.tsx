import RequireAuth from '@/components/auth/RequireAuth'
import ProfileView from '@/components/profile/ProfileView'
import React from 'react'

type PageProps = {
    searchParams: Promise<{ tab?: string }>
}

const page = async ({ searchParams }: PageProps) => {
    const { tab } = await searchParams
    const activeTab = tab === 'tickets' ? 'tickets' : 'profile' 

    return (
        <RequireAuth>
            <ProfileView tab={activeTab}/>
        </RequireAuth>
    )
}

export default page