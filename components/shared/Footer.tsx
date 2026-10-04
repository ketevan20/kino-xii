import React from 'react'
import Logo from './Logo'

const Footer = () => {
  return (
    <footer className='w-full px-8.5 pt-6.75 pb-8.5 flex flex-col gap-5'>
      <hr className='border-[rgba(42,44,61,1)]'/>
      <div className='w-full flex justify-between'>
        <Logo />
        <p className='text-[rgba(169,169,169,1)] text-body-s'>© 2026 Kino XII. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer