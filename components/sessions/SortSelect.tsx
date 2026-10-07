'use client'
import { useFilterOptions } from '@/providers/FilterOptionsProvider'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { parseSessionsQuery, setParam } from '@/lib/filters'

const DEFAULT_SORT = 'time_asc'

const SortSelect = () => {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return

        const onPointerDown = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) setOpen(false)
        }

        document.addEventListener('mousedown', onPointerDown, true)
        return () => {
            document.removeEventListener('mousedown', onPointerDown, true)
        }
    }, [open])

    const select = (id: string) => {
        setOpen(false)
        if (id === current) return
        const next = setParam(params, 'sort', id === DEFAULT_SORT ? undefined : id)
        router.push(`?${next}`, { scroll: false })
    }
    const options = useFilterOptions()
    const { sorts } = options
    const router = useRouter()
    const params = new URLSearchParams(useSearchParams().toString())

    const current = parseSessionsQuery(params, options).sort ?? DEFAULT_SORT

    return (
        <div ref={ref} className='relative'>
            <button
                type='button'
                aria-haspopup='listbox'
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                className='flex items-center gap-2'
            >
                <span className='text-muted text-body-m'>Sort:</span>
                <span className='text-button text-fg'>
                    {sorts.find((s) => s.id === current)?.label}
                </span>
                <img
                    src='/arrow-down.svg'
                    alt=''
                    aria-hidden='true'
                    className={`pointer-events-none size-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && (
                <div
                    role='listbox'
                    aria-label='Sort sessions'
                    className='w-full right-0 absolute top-7 z-50 flex min-w-50 flex-col gap-1 rounded-lg bg-card py-1.5 border border-elevated'
                >
                    {sorts.map((s) => (
                        <button
                            key={s.id}
                            type='button'
                            role='option'
                            aria-selected={s.id === current}
                            onClick={() => select(s.id)}
                            className={`w-full p-2 text-left text-button text-fg hover:bg-elevated ${s.id === current ? 'bg-elevated' : ''
                                }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SortSelect