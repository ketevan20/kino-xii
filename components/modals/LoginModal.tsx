'use client'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ApiError } from '@/lib/api/errors'
import { useAuth } from '@/providers/AuthProvider'
import { LoginForm, loginSchema } from '@/validators/auth'


const LoginModal = () => {
  const { login, closeModal, openModal } = useAuth()
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<LoginForm>({ resolver: yupResolver(loginSchema) })

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [closeModal])

  const onSubmit = async (values: LoginForm) => {
    setServerError('')
    try {
      await login(values) // on success AuthProvider closes the modal
    } catch (e) {
      if (e instanceof ApiError && e.isFieldError) {
        Object.entries(e.errors!).forEach(([field, msgs]) =>
          setError(field as keyof LoginForm, { message: msgs[0] })
        )
      } else if (e instanceof ApiError) {
        setServerError(e.message)
      } else {
        setServerError('Something went wrong. Please try again.')
      }
    }
  }

  return (
    <div
      onClick={closeModal}
      className='fixed inset-0 z-50 flex items-center justify-center bg-[#101010]/30 p-4 backdrop-blur-xs'
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className='relative w-100 rounded-[28px] bg-page p-8 border border-elevated shadow-[0_1px_4px_0_rgba(0,0,0,0.25)]'
      >
        <div className='w-full flex justify-between'>
          <div className='flex flex-col gap-2'>
            <h2 className='text-h2 text-fg'>Log In</h2>
            <p className='text-muted text-body-s'>Welcome back to Kino XII</p>
          </div>
          <button
            type='button'
            onClick={closeModal}
            aria-label='Close'
            className='self-start hover:text-muted text-fg'
          >
            ✕
          </button>
        </div>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className='relative my-6 flex flex-col gap-7'>
          <div className='relative flex flex-col gap-2.5'>
            <label htmlFor='login-email' className={`text-label-s ${errors.email ? 'text-brand' : 'text-fg'}`}>
              Email
            </label>
            <input
              id='login-email'
              type='email'
              placeholder='example@gmail.com'
              autoComplete='email'
              autoFocus
              {...register('email')}
              className={`h-10 rounded-xl bg-card px-4 text-label-s outline-none border ${errors.email ? 'text-brand border-brand' : 'text-fg border-subtle'}`}
            />
            {errors.email && <p className='absolute -bottom-2 translate-y-full text-label-s text-brand'>{errors.email.message}</p>}
          </div>

          <div className='relative flex flex-col gap-2.5'>
            <label htmlFor='login-password' className={`text-label-s ${errors.password ? 'text-brand' : 'text-fg'}`}>
              Password
            </label>
            <input
              id='login-password'
              type='password'
              autoComplete='current-password'
              {...register('password')}
              className={`h-10 rounded-xl bg-card px-4 text-label-s outline-none border ${errors.password ? 'text-brand border-brand' : 'text-fg border-subtle'}`}
            />
            {errors.password && (
              <p className='absolute -bottom-2 translate-y-full text-label-s text-brand'>{errors.password.message}</p>
            )}
          </div>

          {serverError && <p className='absolute bottom-11 text-label-s text-brand'>{serverError}</p>}

          <button
            type='submit'
            disabled={isSubmitting || Object.keys(errors).length > 0}
            className={`mt-2 rounded-full text-fg bg-brand disabled:bg-subtle disabled:text-muted px-5.5 py-3.25 text-label-m`}
          >
            {isSubmitting ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <p className='mt-6 text-center text-body-m text-muted'>
          Don&apos;t have an account?{' '}
          <button type='button' onClick={() => openModal('register')} className='text-brand text-button hover:underline'>
            Sign Up
          </button>
        </p>
      </div>
    </div>
  )
}

export default LoginModal