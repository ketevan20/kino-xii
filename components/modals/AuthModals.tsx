'use client'

import { useAuth } from '@/providers/AuthProvider'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'

export default function AuthModals() {
  const { modal } = useAuth()

  if (modal === 'login') return <LoginModal />
  if (modal === 'register') return <RegisterModal />   
  return null
}