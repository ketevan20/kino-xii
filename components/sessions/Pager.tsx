'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { setPage } from '@/lib/filters'

const SIBLINGS = 1

const getPageItems = (current: number, last: number): (number | '…')[] => {
    const pages = new Set([1, last])
    for (let p = current - SIBLINGS; p <= current + SIBLINGS; p++) pages.add(p)

    const sorted = [...pages].filter((p) => p >= 1 && p <= last).sort((a, b) => a - b)

    const items: (number | '…')[] = []
    sorted.forEach((p, i) => {
        if (i > 0) {
            const gap = p - sorted[i - 1]
            if (gap === 2) items.push(sorted[i - 1] + 1)
            else if (gap > 2) items.push('…')
        }
        items.push(p)
    })
    return items
}

const circle = 'size-10 rounded-full flex items-center justify-center text-label-s'

const Pager = ({ currentPage, lastPage }: { currentPage: number; lastPage: number }) => {
    const params = new URLSearchParams(useSearchParams().toString())
    if (lastPage <= 1) return null

    const href = (p: number) => `?${setPage(params, p)}`

    return (
        <nav aria-label='Pagination' className='mt-13 w-full flex items-center justify-center gap-2'>
            {currentPage > 1 ? (
                <Link href={href(currentPage - 1)} aria-label='Previous page' className={`${circle} bg-card text-fg hover:bg-elevated`}>
                    <img src="/arrow-down.svg" alt="" className='rotate-90' />
                </Link>
            ) : (
                <span aria-hidden='true' className={`${circle} bg-card text-fg opacity-40`}>
                    <img src="/arrow-down.svg" alt="" className='rotate-90' />
                </span>
            )}

            {getPageItems(currentPage, lastPage).map((item, i) =>
                item === '…' ? (
                    <span key={`gap-${i}`} className={`${circle} text-muted`}>…</span>
                ) : item === currentPage ? (
                    <span key={item} aria-current='page' className={`${circle} bg-brand text-fg`}>{item}</span>
                ) : (
                    <Link key={item} href={href(item)} className={`${circle} text-muted hover:bg-elevated`}>{item}</Link>
                )
            )}

            {currentPage < lastPage ? (
                <Link href={href(currentPage + 1)} aria-label='Next page' className={`${circle} bg-card text-fg hover:bg-elevated`}>
                    <img src="/arrow-down.svg" alt="" className='-rotate-90' />
                </Link>
            ) : (
                <span aria-hidden='true' className={`${circle} bg-card text-fg opacity-40`}>
                    <img src="/arrow-down.svg" alt="" className='-rotate-90' />
                </span>
            )}
        </nav>
    )
}

export default Pager