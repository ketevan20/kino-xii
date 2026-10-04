import Link from 'next/link'
import React from 'react'

const Logo = () => {
    return (
        <Link href={'/'}>
            <div className='text-white text-h2'>
                KINO <span className='text-[rgba(236,48,19,1)]'>XII</span>
            </div>
        </Link>
    )
}

export default Logo