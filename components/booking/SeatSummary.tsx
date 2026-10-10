import { useFilterOptions } from '@/providers/FilterOptionsProvider'
import type { ListSession, SelectedSeat, TicketSlug } from '@/types/api'

const money = (n: number) => `₾${Number(n.toFixed(2))}`

type Props = {
  session: ListSession
  selected: SelectedSeat[]
  notice: string
  onChangeType: (seatId: number, type: TicketSlug) => void
  onRemove: (seatId: number) => void
  onNext: () => void
}

const SeatSummary = ({ session, selected, notice, onChangeType, onRemove, onNext }: Props) => {
  const { ticketTypes, maxSeatsPerOrder } = useFilterOptions()
  const minAge = session.movie.ageRating.minAge

  const offered = [...ticketTypes]
    .filter((t) => t.blockedFromRatingAge === null || minAge < t.blockedFromRatingAge)
    .sort((a, b) => a.priceRatio - b.priceRatio)

  const ratioOf = (slug: TicketSlug) => ticketTypes.find((t) => t.slug === slug)?.priceRatio ?? 1
  const priceOf = (s: SelectedSeat) => session.price * ratioOf(s.ticketType)
  const subtotal = selected.reduce((sum, s) => sum + priceOf(s), 0)

  return (
    <aside className='flex-1 shrink-0 w-80.25 flex flex-col gap-3 justify-between'>
      <div className='flex flex-col gap-3'>
        <h3 className='text-button text-fg'>Your seats · Max {maxSeatsPerOrder}</h3>
        {notice && <p className='text-label-s py-2 px-3.5 rounded-xl bg-warning/10 text-warning'>{notice}</p>}

        {selected.length === 0 ? (<p className='text-body-s text-muted'>Pick up to 3 seats from the map. Each seat can carry its own ticket type.</p>) : (
          <ul className='flex flex-col gap-3'>
            {selected.map((s) => (
              <li
                key={s.seat.id}
                className='flex flex-col gap-3 rounded-2xl border border-elevated bg-card p-3.5'
              >
                <div className='flex items-center justify-between text-label-s'>
                  <span className='text-muted'>
                    Seat <span className='ml-2 text-fg'>{s.seat.code}</span>
                  </span>
                  <span className='flex items-center gap-3 text-fg'>
                    {money(priceOf(s))}
                    <button
                      type='button'
                      onClick={() => onRemove(s.seat.id)}
                      aria-label={`Remove seat ${s.seat.code}`}
                      className='text-muted hover:text-fg'
                    >
                      ✕
                    </button>
                  </span>
                </div>

                <div className='flex gap-2'>
                  {offered.map((t) => (
                    <button
                      key={t.slug}
                      type='button'
                      aria-pressed={s.ticketType === t.slug}
                      onClick={() => onChangeType(s.seat.id, t.slug)}
                      className={`flex-1 rounded-full px-2 py-2 text-label-s ${s.ticketType === t.slug
                        ? 'bg-brand text-fg'
                        : 'bg-elevated text-muted hover:text-fg'
                        }`}
                    >
                      {t.name} {Math.round(t.priceRatio * 100)}%
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className='flex flex-col gap-3'>
        <div className='flex items-end justify-between border-t border-elevated pt-4'>
          <span className='text-overline uppercase text-muted'>Subtotal</span>
          <span className='text-h2 text-fg'>{money(subtotal)}</span>
        </div>

        <button
          type='button'
          disabled={selected.length === 0}
          onClick={onNext}
          className='rounded-full bg-brand px-5.5 py-3.25 text-label-m text-fg disabled:bg-subtle disabled:text-muted'
        >
          Next: Checkout
        </button>
      </div>
    </aside>
  )
}

export default SeatSummary