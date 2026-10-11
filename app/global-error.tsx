'use client'
import './globals.css'

export default function GlobalError() {
    return (
        <html lang='en'>
            <body className='bg-page text-fg'>
                <div className='flex min-h-screen flex-col items-center justify-center gap-4 text-center'>
                    <h1 className='text-h2'>Kino XII is unavailable right now</h1>
                    <p className='text-body-m text-muted'>Please check your connection and try again.</p>
                    <button
                        type='button'
                        onClick={() => window.location.reload()}
                        className='rounded-full bg-brand px-6 py-3 text-label-m text-fg'
                    >
                        Reload
                    </button>
                </div>
            </body>
        </html>
    )
}