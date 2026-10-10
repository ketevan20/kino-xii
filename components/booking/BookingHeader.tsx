import type { ListSession } from '@/types/api'

const longDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  })

const BookingHeader = ({ session }: { session: ListSession | null }) => (
  <div className='w-full flex justify-between'>
    <div className='flex flex-col gap-2'>
      <h2 className='text-h2 text-fg uppercase'>{session ? session.movie.title : 'Book tickets'}</h2>
      {session && (
        <p className='text-body-s text-muted'>
          {session.venue.name} · Hall {session.hall.name} · {longDate(session.date)} · {session.time} ·{' '}
          {session.format.name} · {session.language.name}
        </p>
      )}
    </div>

    <div className='bg-card rounded-xl px-3.5 py-2 flex flex-col items-center justify-center gap-0.5'>
      <p className='text-label-s text-muted'>SEATS HELD</p>
      <h1 className='text-button text-fg'>time</h1>
    </div>
  </div>
)

export default BookingHeader