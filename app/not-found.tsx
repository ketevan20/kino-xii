import Link from 'next/link'

export default function NotFound() {
    return (
        <div className='flex flex-col items-center gap-4 px-12.75 py-40 text-center'>
            <h1 className='text-h2 text-fg'>Page not found</h1>
            <p className='text-body-m text-muted'>We couldn't find what you were looking for.</p>
            <Link href='/' className='rounded-full bg-brand px-6 py-3 text-label-m text-fg'>
                Back to home
            </Link>
        </div>
    )
}