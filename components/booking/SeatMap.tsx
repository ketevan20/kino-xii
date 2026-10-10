import { Fragment } from 'react'
import type { Seat, SeatMap as SeatMapData } from '@/types/api'

const HATCH =
  'bg-[repeating-linear-gradient(135deg,transparent_0_4px,rgba(255,255,255,0.14)_4px_6px)]'

const SeatButton = ({ seat, selected, onToggle }: { seat: Seat; selected: boolean; onToggle: (seat: Seat) => void }) => {
  if (seat.state === 'unavailable') return <span className='size-13' aria-hidden='true' />

  const blocked = seat.state !== 'available'

  const look = selected
    ? 'border-brand bg-brand text-fg'
    : seat.state === 'sold'
      ? 'border-transparent bg-card text-subtle'
      : blocked
        ? `border-muted text-muted ${HATCH}`
        : 'border-subtle bg-card text-fg hover:border-fg'

  return (
    <button
      type='button'
      disabled={blocked}
      aria-pressed={selected}
      aria-label={`Seat ${seat.code}${blocked ? ', not available' : ''}`}
      onClick={() => onToggle(seat)}
      className={`flex size-13 items-center justify-center rounded-[10px] border text-label-s disabled:cursor-not-allowed ${look}`}
    >
      {seat.label}
    </button>
  )
}

const Legend = () => (
  <ul className='flex flex-wrap justify-center gap-6 text-label-s text-muted'>
    <li className='flex items-center gap-2'>
      <span className='size-4 rounded border border-subtle bg-card' /> Available
    </li>
    <li className='flex items-center gap-2'>
      <span className='size-4 rounded border border-brand bg-brand' /> Selected
    </li>
    <li className='flex items-center gap-2'>
      <span className='size-4 rounded bg-card' /> Sold
    </li>
    <li className='flex items-center gap-2'>
      <span className={`size-4 rounded border border-subtle ${HATCH}`} /> Held by another user
    </li>
  </ul>
)

type Props = {
  seatMap: SeatMapData
  selectedIds: Set<number>
  onToggle: (seat: Seat) => void
}

const SeatMap = ({ seatMap, selectedIds, onToggle }: Props) => (
  <div className='flex flex-col gap-8 my-5'>
    <div className='mx-5 bg-elevated rounded-b-[20px] h-7.5 uppercase flex items-center justify-center text-label-s'>
      Screen
    </div>

    <div className='overflow-x-auto scrollbar-none px-10'>
      <div className='mx-auto flex w-fit flex-col items-center gap-8'>
        {seatMap.sections.map((section) => (
          <div key={section.name} className='flex flex-col gap-2.5'>
            <p className='mb-2.5 text-overline uppercase text-muted'>{section.name} · Rows {section.rows[0].label}-{section.rows[section.rows.length - 1].label}</p>
            {section.rows.map((row) => (
              <div key={row.label} className='flex items-center gap-2'>
                <span className='w-5 text-center text-label-s text-muted'>{row.label}</span>
                {row.seats.map((seat) => (
                  <Fragment key={seat.id}>
                    <SeatButton
                      seat={seat}
                      selected={selectedIds.has(seat.id)}
                      onToggle={onToggle}
                    />
                    {seat.aisleAfter && <span className='w-6' aria-hidden='true' />}
                  </Fragment>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>

    <Legend />
  </div>
)

export default SeatMap