import type { ListSession } from '@/types/api'

const longDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  })

const BookingHeader = ({ session }: { session: ListSession | null }) => (
  <div className='flex flex-col gap-2'>
    <h2 className='text-h2 text-fg uppercase'>{session ? session.movie.title : 'Book tickets'}</h2>
    {session && (
      <p className='text-body-s text-muted'>
        {session.venue.name} · Hall {session.hall.name} · {longDate(session.date)} · {session.time} ·{' '}
        {session.format.name} · {session.language.name}
      </p>
    )}
  </div>
)

export default BookingHeader