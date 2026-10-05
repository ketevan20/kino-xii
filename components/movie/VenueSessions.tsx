import { VenueSessions as VenueSessionsType } from '@/types/api'
import SessionCard from './SessionCard'

const VenueSessions = ({ venue }: { venue: VenueSessionsType }) => {
  const halls = new Map<string, VenueSessionsType['sessions']>()
  for (const s of venue.sessions) {
    halls.set(s.hall.name, [...(halls.get(s.hall.name) ?? []), s])
  }

  return (
    <div className='flex flex-col gap-3'>
      <p className='text-button text-fg'>{venue.venue.name}</p>

      <div className='flex flex-wrap gap-2.5'>
        {[...halls].map(([hallName, sessions]) => (
          <div
            key={hallName}
            className='flex flex-col gap-2.25 rounded-[18px] bg-card p-3.75'
          >
            <p className='text-label-s text-fg'>Hall {hallName}</p>
            <div className='flex gap-2.25'>
              {sessions.map((s) => (
                <SessionCard key={s.id} session={s} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VenueSessions