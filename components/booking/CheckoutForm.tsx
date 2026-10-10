'use client'
import { useFormContext } from 'react-hook-form'
import { checkoutSchema, type CheckoutValues } from '@/validators/checkout'

const inputClass = (hasError: boolean) => `h-10 w-full rounded-xl bg-card px-4 text-label-s outline-none border placeholder:text-muted ${hasError ? 'text-brand border-brand' : 'text-fg border-subtle'}`

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

const Field = ({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) => (
    <div className='relative flex flex-col gap-2.5'>
        <label htmlFor={id} className={`text-label-s ${error ? 'text-brand' : 'text-fg'}`}>
            {label}
        </label>
        {children}
        {error && <p className='absolute -bottom-2 translate-y-full text-label-s text-brand'>{error}</p>}
    </div>
)

const CheckoutForm = () => {
    const { register, watch, formState: { errors } } = useFormContext<CheckoutValues>()
    const values = watch()

    const ok = (name: 'fullName' | 'email' | 'mobileNumber') => {
        if (errors[name]) return false

        try {
            checkoutSchema.validateSyncAt(name, values)
            return true
        } catch {
            return false
        }
    }

    return (
        <div className='flex flex-col gap-7'>
            <Field id='checkout-name' label='Full Name' error={errors.fullName?.message}>
                <div className='relative'>
                    <input
                        id='checkout-name'
                        type='text'
                        autoComplete='name'
                        placeholder='e.g. Jane Dolidze'
                        {...register('fullName')}
                        className={`${inputClass(!!errors.fullName)} pr-10`}
                    />
                    {ok('fullName') && <Check />}
                </div>
            </Field>

            <div className='grid grid-cols-2 gap-3'>
                <Field id='checkout-email' label='Email' error={errors.email?.message}>
                    <div className='relative'>
                        <input
                            id='checkout-email'
                            type='email'
                            autoComplete='email'
                            placeholder='e.g. jane@example.com'
                            {...register('email')}
                            className={`${inputClass(!!errors.email)} pr-10`}
                        />
                        {ok('email') && <Check />}
                    </div>
                </Field>

                <Field id='checkout-mobile' label='Mobile Number' error={errors.mobileNumber?.message}>
                    <div className='relative'>
                        <input
                            id='checkout-mobile'
                            type='tel'
                            inputMode='numeric'
                            autoComplete='tel'
                            placeholder='5XX XXX XXX'
                            {...register('mobileNumber')}
                            className={`${inputClass(!!errors.mobileNumber)} pr-10`}
                        />
                        {ok('mobileNumber') && <Check />}
                    </div>
                </Field>
            </div>

            <div className='border-t border-elevated' />

            <Field id='checkout-card' label='Card Number' error={errors.cardNumber?.message}>
                <input
                    id='checkout-card'
                    type='text'
                    inputMode='numeric'
                    autoComplete='cc-number'
                    placeholder='1234 5678 9012 3456'
                    {...register('cardNumber')}
                    className={inputClass(!!errors.cardNumber)}
                />
            </Field>

            <div className='grid grid-cols-2 gap-3'>
                <Field id='checkout-expiry' label='Expiry' error={errors.expiry?.message}>
                    <input
                        id='checkout-expiry'
                        type='text'
                        inputMode='numeric'
                        autoComplete='cc-exp'
                        placeholder='MM/YY'
                        maxLength={5}
                        {...register('expiry')}
                        className={inputClass(!!errors.expiry)}
                    />
                </Field>

                <Field id='checkout-cvv' label='CVV' error={errors.cvv?.message}>
                    <input
                        id='checkout-cvv'
                        type='password'
                        inputMode='numeric'
                        autoComplete='cc-csc'
                        placeholder='123'
                        maxLength={3}
                        {...register('cvv')}
                        className={inputClass(!!errors.cvv)}
                    />
                </Field>
            </div>
        </div>
    )
}

export default CheckoutForm