'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link'
import { getNextDays } from '@/lib/filters';

const DateStrip = ({ comingSoon }: { comingSoon: boolean }) => {
  const days = getNextDays(7)

  const searchParams = useSearchParams();
  const activeDay = searchParams.get('date') ? searchParams.get('date') : days[0].key;

  return (
    <nav aria-label='Choose a date' className='flex gap-1.75 overflow-x-auto scrollbar-none'>
      {days.map((d) => {
        const isActive = d.key === activeDay
        return (
          <Link
            key={d.key}
            href={comingSoon ? '#' : `?date=${d.key}`}
            scroll={false}
            aria-current={isActive ? 'date' : undefined}
            aria-disabled={comingSoon}
            tabIndex={comingSoon ? -1 : undefined}
            onClick={(event) => {
              if (comingSoon) {
                event.preventDefault()
                return
              }
            }}
            className={`flex h-20 flex-col items-center justify-center gap-1.5 rounded-2xl px-2.5 py-2.25 transition-[width] duration-400 ease-out ${isActive ? 'w-27.25 bg-brand' : 'w-20 bg-card'} ${comingSoon && !isActive ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
          >
            <span className='text-label-s text-fg'>{d.weekday}</span>
            <span className='text-h3 text-fg'>{d.day}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default DateStrip