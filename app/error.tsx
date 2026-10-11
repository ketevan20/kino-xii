'use client'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export default function Error({ reset }: { error: Error; reset: () => void }) {
    const router = useRouter()
    const [pending, startTransition] = useTransition()

    const retry = () =>
        startTransition(() => {
            router.refresh()
            reset()
        })

    return (
        <div className='flex flex-col items-center gap-4 px-12.75 py-40 text-center'>
            <h1 className='text-h2 text-fg'>Something went wrong</h1>
            <p className='text-body-m text-muted'>We couldn't load this page. Please try again.</p>
            <button
                type='button'
                onClick={retry}
                disabled={pending}
                className='rounded-full bg-brand px-6 py-3 text-label-m text-fg disabled:opacity-60'
            >
                {pending ? 'Trying…' : 'Try again'}
            </button>
        </div>
    )
}