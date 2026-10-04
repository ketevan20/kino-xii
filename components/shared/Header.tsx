import React from 'react'
import SearchBar from './SearchBar'
import Logo from './Logo'
import Link from 'next/link'

const Header = () => {
  return (
    <header className="absolute inset-x-0 top-0 z-20 bg-linear-to-b from-black from-0% via-black/50 via-80% to-transparent to-100% w-full px-15 pt-7.5 pb-10 flex justify-between items-center">
      <div className='flex gap-9 items-center'>
        <Logo />
        <Link href={'/sessions'} className='text-overline text-fg'>
          SESSIONS
        </Link>
      </div>

      <div className='flex gap-8 items-center'>
        <SearchBar />
        <div className='flex gap-3'>
          <button>Sign up</button>
          <button>Sign in</button>
        </div>
      </div>
    </header>
  )
}

export default Header