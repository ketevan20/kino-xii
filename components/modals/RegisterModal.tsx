'use client'
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ApiError } from '@/lib/api/errors'
import { useAuth } from '@/providers/AuthProvider'
import { RegisterForm, registerSchema } from '@/validators/auth'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_AVATAR_SIZE = 2 * 1024 * 1024

const inputClass = (hasError: boolean) =>
  `h-10 w-full rounded-xl bg-card px-4 text-label-s outline-none border ${hasError ? 'text-brand border-brand' : 'text-fg border-subtle'}`

const Check = () => (
  <svg
    viewBox='0 0 24 24'
    aria-hidden='true'
    className='pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-green-400'
    fill='none'
    stroke='currentColor'
    strokeWidth='2.5'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M5 12l5 5L20 7' />
  </svg>
)

const RegisterModal = () => {
  const { register: signUp, closeModal, openModal } = useAuth()
  const [serverError, setServerError] = useState('')
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarError, setAvatarError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, setError, watch, getValues, trigger, formState: { errors, isSubmitting, isValid } } = useForm<RegisterForm>({ resolver: yupResolver(registerSchema), mode: 'onTouched' })

  const values = watch()

  const fieldOk = (name: 'username' | 'email') => {
    if (errors[name] || !values[name]) return false
    try {
      registerSchema.validateSyncAt(name, values)
      return true
    } catch {
      return false
    }
  }

  const preview = useMemo(() => (avatar ? URL.createObjectURL(avatar) : null), [avatar])
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [closeModal])

  const onAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      setAvatar(null)
      setAvatarError('Only JPG, PNG or WEBP images are allowed')
    } else if (file.size > MAX_AVATAR_SIZE) {
      setAvatar(null)
      setAvatarError('Image must be 2MB or smaller')
    } else {
      setAvatarError('')
      setAvatar(file)
    }
  }

  const onSubmit = async (v: RegisterForm) => {
    setServerError('')

    const form = new FormData()
    form.append('username', v.username)
    form.append('email', v.email)
    form.append('password', v.password)
    form.append('password_confirmation', v.password_confirmation)
    if (avatar) form.append('avatar', avatar)

    try {
      await signUp(form)
    } catch (e) {
      if (e instanceof ApiError && e.isFieldError) {
        Object.entries(e.errors!).forEach(([field, msgs]) => {
          if (field === 'avatar') setAvatarError(msgs[0])
          else setError(field as keyof RegisterForm, { message: msgs[0] })
        })
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
        className='relative w-118.75 rounded-[28px] bg-page p-8 border border-elevated shadow-[0_1px_4px_0_rgba(0,0,0,0.25)]'
      >
        <div className='w-full flex justify-between'>
          <div className='flex flex-col gap-2'>
            <h2 className='text-h2 text-fg'>Sign up</h2>
            <p className='text-muted text-body-s'>Welcome to Kino XII</p>
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
          {/* avatar (optional) */}
          <div className='mb-1 flex flex-col gap-2'>
            <button
              type='button'
              onClick={() => fileRef.current?.click()}
              className='flex items-center gap-3 text-left cursor-pointer'
            >
              <span className='flex size-10 shrink-0 items-center justify-center overflow-hidden border-[0.5px] border-elevated rounded-lg bg-fg/10'>
                {preview ? (
                  <img src={preview} alt='Avatar preview' className='size-full object-cover' />
                ) : (
                  <img src={'/upload.svg'} />
                )}
              </span>
              <span className='flex flex-col gap-0.75'>
                <span className='text-button text-fg'>Upload avatar (optional)</span>
                <span className='text-body-s text-muted'>JPG, PNG or WEBP</span>
              </span>
            </button>
            <input
              ref={fileRef}
              type='file'
              accept='image/jpeg,image/png,image/webp'
              onChange={onAvatarChange}
              className='hidden'
            />
            {avatarError && <p className='text-label-s text-brand'>{avatarError}</p>}
          </div>

          {/* username */}
          <div className='relative flex flex-col gap-2.5'>
            <label htmlFor='register-username' className={`text-label-s ${errors.username ? 'text-brand' : 'text-fg'}`}>
              Username
            </label>
            <div className='relative'>
              <input
                id='register-username'
                type='text'
                placeholder='User'
                autoComplete='username'
                autoFocus
                {...register('username')}
                className={`${inputClass(!!errors.username)} pr-10 hover:bg-elevated`}
              />
              {fieldOk('username') && <Check />}
            </div>
            {errors.username && (
              <p className='absolute -bottom-2 translate-y-full text-label-s text-brand'>{errors.username.message}</p>
            )}
          </div>

          {/* email */}
          <div className='relative flex flex-col gap-2.5'>
            <label htmlFor='register-email' className={`text-label-s ${errors.email ? 'text-brand' : 'text-fg'}`}>
              Email
            </label>
            <div className='relative'>
              <input
                id='register-email'
                type='email'
                placeholder='example@gmail.com'
                autoComplete='email'
                {...register('email')}
                className={`${inputClass(!!errors.email)} pr-10 hover:bg-elevated`}
              />
              {fieldOk('email') && <Check />}
            </div>
            {errors.email && (
              <p className='absolute -bottom-2 translate-y-full text-label-s text-brand'>{errors.email.message}</p>
            )}
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='relative flex flex-col gap-2.5'>
              <label htmlFor='register-password' className={`text-label-s ${errors.password ? 'text-brand' : 'text-fg'}`}>
                Password
              </label>
              <input
                id='register-password'
                type='password'
                autoComplete='new-password'
                {...register('password', {
                  onChange: () => {
                    if (getValues('password_confirmation')) trigger('password_confirmation')
                  },
                })}
                className={`${inputClass(!!errors.password)} hover:bg-elevated`}
              />
              {errors.password && (
                <p className='absolute -bottom-2 translate-y-full text-label-s text-brand'>{errors.password.message}</p>
              )}
            </div>

            <div className='relative flex flex-col gap-2.5'>
              <label
                htmlFor='register-password-confirmation'
                className={`text-label-s ${errors.password_confirmation ? 'text-brand' : 'text-fg'}`}
              >
                Confirm password
              </label>
              <input
                id='register-password-confirmation'
                type='password'
                autoComplete='new-password'
                {...register('password_confirmation')}
                className={`${inputClass(!!errors.password_confirmation)} hover:bg-elevated`}
              />
              {errors.password_confirmation && (
                <p className='absolute -bottom-2 translate-y-full text-label-s text-brand'>
                  {errors.password_confirmation.message}
                </p>
              )}
            </div>
          </div>

          {serverError && <p className='absolute bottom-11 text-label-s text-brand'>{serverError}</p>}

          <button
            type='submit'
            disabled={!isValid || isSubmitting || !!avatarError}
            className='mt-2 rounded-full text-fg bg-brand disabled:bg-subtle disabled:text-muted px-5.5 py-3.25 text-label-m'
          >
            {isSubmitting ? 'Signing up…' : 'Sign up'}
          </button>
        </form>

        <p className='mt-6 text-center text-body-m text-muted'>
          Already have an account?{' '}
          <button type='button' onClick={() => openModal('login')} className='text-brand text-button hover:underline'>
            Log in
          </button>
        </p>
      </div>
    </div>
  )
}

export default RegisterModal