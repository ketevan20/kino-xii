import { useAuth } from '@/providers/AuthProvider'
import Image from 'next/image'

const AccountMenu = () => {
    const { user, openModal, logout } = useAuth()

    return (
        <div>
            <button className='flex gap-3'>
                <div>
                    {user?.avatar ? (
                        <Image
                            src={user.avatar}
                            alt="Account avatar"
                            width={40}
                            height={40}
                            className="rounded-lg"
                        />
                    ) :
                        <div className='flex items-center justify-center rounded-lg bg-card text-fg text-label-s'>
                            {user?.username[0]}
                        </div>
                    }
                </div>
            </button>
        </div>
    )
}

export default AccountMenu