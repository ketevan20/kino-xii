import { ApiError } from '@/lib/api/errors'
import { updateProfile } from '@/lib/api/profile'
import { useAuth } from '@/providers/AuthProvider'
import { useFilterOptions } from '@/providers/FilterOptionsProvider'
import { User } from '@/types/api'
import { ProfileFormValues, profileSchema } from '@/validators/profile'
import { yupResolver } from '@hookform/resolvers/yup'
import { Loader } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

const valuesFrom = (user: User): ProfileFormValues => ({
    fullName: user.fullName ?? '',
    mobileNumber: user.mobileNumber ?? '',
    dateOfBirth: user.dateOfBirth ?? '',
    preferredVenueId: user.preferredVenue ? String(user.preferredVenue.id) : '',
})

const inputClass = (hasError: boolean) => `h-10 w-full rounded-[12px] bg-card px-4 text-label-s outline-none border ${hasError ? 'text-brand border-brand' : 'text-fg border-transparent hover:bg-elevated hover:border-muted cursor-pointer'}`

const Field = ({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) => (
    <div className='relative flex flex-col gap-2.5'>
        <label htmlFor={id} className={`text-label-s ${error ? 'text-brand' : 'text-fg'}`}>
            {label}
        </label>
        {children}
        {error && (
            <p className='absolute -bottom-2 translate-y-full text-label-s text-brand'>{error}</p>
        )}
    </div>
)

const ProfileForm = ({ user }: { user: User }) => {
    const { updateUser, requireAuth } = useAuth()
    const { venues, ageRatings } = useFilterOptions()
    const [serverError, setServerError] = useState('')

    const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting, isDirty, isValid, isSubmitSuccessful } } = useForm<ProfileFormValues>({
        resolver: yupResolver(profileSchema),
        mode: 'onTouched',
        defaultValues: valuesFrom(user),
    })

    const onSubmit = (v: ProfileFormValues) =>
        requireAuth(async () => {
            setServerError('')

            const form = new FormData()
            form.append('fullName', v.fullName)
            form.append('mobileNumber', v.mobileNumber)
            form.append('dateOfBirth', v.dateOfBirth)
            if (v.preferredVenueId) form.append('preferredVenueId', v.preferredVenueId)

            try {
                const saved = await updateProfile(form)
                updateUser(saved)
                reset(valuesFrom(saved), { keepIsSubmitSuccessful: true })
            } catch (e) {
                if (!(e instanceof ApiError)) {
                    setServerError('Something went wrong. Please try again.')
                    return
                }
                if (e.status === 401) throw e
                if (e.isFieldError) {
                    Object.entries(e.errors!).forEach(([field, msgs]) =>
                        setError(field as keyof ProfileFormValues, { message: msgs[0] })
                    )
                } else {
                    setServerError(e.message)
                }
            }
        })

    return (
        <div className='w-220'>
            {!user.profileComplete && (
                <p className='rounded-xl bg-warning/10 p-4 text-body-m text-warning mb-10'>
                    Please complete your profile to enable booking.
                </p>
            )}

            <form noValidate onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-7'>
                <Field id='profile-name' label='Full Name' error={errors.fullName?.message}>
                    <input
                        id='profile-name'
                        type='text'
                        autoComplete='name'
                        {...register('fullName')}
                        className={inputClass(!!errors.fullName)}
                    />
                </Field>

                <Field id='profile-email' label='Email'>
                    <input
                        id='profile-email'
                        type='email'
                        value={user.email}
                        disabled
                        readOnly
                        className={`${inputClass(false)} cursor-not-allowed! opacity-60`}
                    />
                    <p className='text-label-s text-muted'>Set at registration and cannot be changed</p>
                </Field>

                <Field id='profile-mobile' label='Mobile Number' error={errors.mobileNumber?.message}>
                    <input
                        id='profile-mobile'
                        type='tel'
                        inputMode='numeric'
                        autoComplete='tel'
                        placeholder='5XX XXX XXX'
                        {...register('mobileNumber')}
                        className={inputClass(!!errors.mobileNumber)}
                    />
                </Field>

                <Field id='profile-dob' label='Date of Birth' error={errors.dateOfBirth?.message}>
                    <input
                        id='profile-dob'
                        type='date'
                        max={new Date().toLocaleDateString('en-CA')}
                        {...register('dateOfBirth')}
                        className={`${inputClass(!!errors.dateOfBirth)} [color-scheme:dark]`}
                    />
                </Field>

                <Field
                    id='profile-venue'
                    label='Preferred Venue (optional)'
                    error={errors.preferredVenueId?.message}
                >
                    <select
                        id='profile-venue'
                        {...register('preferredVenueId')}
                        className={inputClass(!!errors.preferredVenueId)}
                    >
                        <option value=''>No preference</option>
                        {venues.map((v) => (
                            <option key={v.id} value={String(v.id)}>
                                {v.name} · {v.city}
                            </option>
                        ))}
                    </select>
                </Field>

                {serverError && <p className='text-label-s text-brand'>{serverError}</p>}

                <div className='flex items-center gap-4'>
                    <button
                        type='submit'
                        disabled={!isDirty || !isValid || isSubmitting}
                        className='flex gap-2 rounded-full bg-brand px-5.5 py-3.25 text-label-m text-fg disabled:bg-subtle disabled:text-muted'
                    >
                        {isSubmitting && <Loader size={16} className='animate-spin' />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ProfileForm