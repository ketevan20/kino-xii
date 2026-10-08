'use client'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { ApiError } from '@/lib/api/errors'
import { setUnauthorizedHandler } from '@/lib/api/client'
import { getMe, loginRequest, logoutRequest, registerRequest, type LoginInput } from '@/lib/api/auth'
import { getToken, loadToken, saveToken } from '@/lib/auth/token'
import type { User } from '@/types/api'

type Status = 'loading' | 'guest' | 'authed'
type ModalName = 'login' | 'register' 
type Action = () => void | Promise<void>

type AuthContextValue = {
  user: User | null
  status: Status
  modal: ModalName | null
  openModal: (name: ModalName) => void
  closeModal: () => void
  requireAuth: (action: Action) => Promise<void>
  login: (input: LoginInput) => Promise<void>
  register: (form: FormData) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [modal, setModal] = useState<ModalName | null>(null)

  // the action waiting for a successful login (a ref: see section 2)
  const pending = useRef<Action | null>(null)

  const becomeGuest = useCallback(() => {
    saveToken(null)
    setUser(null)
    setStatus('guest')
  }, [])

  // restore the session on boot
  useEffect(() => {
    if (!loadToken()) {
      setStatus('guest')
      return
    }
    getMe()
      .then((u) => {
        setUser(u)
        setStatus('authed')
      })
      .catch((e) => {
        if (e instanceof ApiError && e.status === 401) saveToken(null)
        setStatus('guest')
      })
  }, [])

  // a 401 from any other endpoint: the session is gone, ask for login
  useEffect(() => {
    setUnauthorizedHandler(() => {
      becomeGuest()
      setModal('login')
    })
  }, [becomeGuest])

  // run an action; if the API answers 401, park it and ask for login
  const run = useCallback(async (action: Action) => {
    try {
      await action()
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        pending.current = action
        setModal('login')
      } else {
        throw e
      }
    }
  }, [])

  // use this for every protected click
  const requireAuth = useCallback(
    (action: Action) => {
      if (!getToken()) {
        pending.current = action
        setModal('login')
        return Promise.resolve()
      }
      return run(action)
    },
    [run]
  )

  // login and register both finish here
  const completeAuth = useCallback(
    (token: string, nextUser: User) => {
      saveToken(token) // first, so the replayed action sends the NEW token
      setUser(nextUser)
      setStatus('authed')
      setModal(null)

      const action = pending.current
      pending.current = null // clear before running, so a failing replay can't loop
      if (action) void run(action)
    },
    [run]
  )

  const login = useCallback(
    async (input: LoginInput) => {
      const result = await loginRequest(input)
      completeAuth(result.token, result.user)
    },
    [completeAuth]
  )

  const register = useCallback(
    async (form: FormData) => {
      const result = await registerRequest(form)
      completeAuth(result.token, result.user)
    },
    [completeAuth]
  )

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } catch {
      // clear locally whatever the server said
    }
    becomeGuest()
  }, [becomeGuest])

  // switching login <-> register keeps the parked action
  const openModal = useCallback((name: ModalName) => setModal(name), [])

  // closing without logging in means the user gave up: forget the action
  const closeModal = useCallback(() => {
    setModal(null)
    pending.current = null
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, status, modal, openModal, closeModal, requireAuth, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}