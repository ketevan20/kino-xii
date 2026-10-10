'use client'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ApiError } from '@/lib/api/errors'
import { useAuth } from '@/providers/AuthProvider'
import { checkoutSchema, type CheckoutValues } from '@/validators/checkout'
import type { ListSession, Order, SeatHold } from '@/types/api'
import CheckoutForm from './CheckoutForm'
import OrderSummary from './OrderSummary'
import StepTabs from './StepTabs'
import { createOrder } from '@/lib/api/booking'

type Props = {
    session: ListSession
    hold: SeatHold
    onBack: () => void
    onPaid: (order: Order) => void
    onSeatsLost: (lost: string[], fallback: string) => void
    onHoldGone: (message: string) => void
}

const CheckoutStep = ({ session, hold, onBack, onPaid, onSeatsLost, onHoldGone }: Props) => {
    const { user } = useAuth()
    const [formError, setFormError] = useState('')

    const methods = useForm<CheckoutValues>({
        resolver: yupResolver(checkoutSchema),
        mode: 'onTouched',
        defaultValues: {
            fullName: user?.fullName ?? '',
            email: user?.email ?? '',
            mobileNumber: user?.mobileNumber ?? '',
            cardNumber: '',
            expiry: '',
            cvv: '',
        },
    })
    const {
        handleSubmit,
        setError,
        formState: { isValid, isSubmitting },
    } = methods

    const onSubmit = async (values: CheckoutValues) => {
        setFormError('')
        try {
            const order = await createOrder({
                holdId: hold.holdId,
                ...values,
                fullName: values.fullName as string,
                mobileNumber: values.mobileNumber as string,
            })
            onPaid(order)
        } catch (e) {
            if (!(e instanceof ApiError)) {
                setFormError('Something went wrong. Please try again.')
            } else if (e.status === 409) {
                const lost = (e.body as { contested?: string[] } | null)?.contested ?? []
                onSeatsLost(lost, e.message)
            } else if (e.isFieldError) {
                Object.entries(e.errors!).forEach(([field, msgs]) =>
                    setError(field as keyof CheckoutValues, { message: msgs[0] })
                )
            } else if (e.isRuleError) {
                onHoldGone(e.message) 
            } else if (e.status !== 401) {
                setFormError(e.message) 
            }
        }
    }

    return (
        <FormProvider {...methods}>
            <form
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                className='grid grid-cols-[minmax(0,1fr)_380px] gap-6'
            >
                <div className='flex flex-col gap-6'>
                    <StepTabs step={2} onBack={onBack} />
                    <CheckoutForm />
                    {formError && (
                        <p role='alert' className='text-label-s text-brand'>
                            {formError}
                        </p>
                    )}
                </div>

                <OrderSummary session={session} hold={hold} canPay={isValid} paying={isSubmitting} />
            </form>
        </FormProvider>
    )
}

export default CheckoutStep