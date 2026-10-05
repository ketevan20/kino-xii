'use client'
import { MovieDetail, VenueSessions as VenueSessionsType } from '@/types/api'
import { useState } from 'react'
import DateStrip from './DateStrip'
import VenueSessions from './VenueSessions'

const SessionsSection = ({ movie, sessions, weekSessionCount }: { movie: MovieDetail, sessions: VenueSessionsType[], weekSessionCount: number }) => {
  const [active, setActive] = useState<string>('')

  return (
    <section className='flex-1 pb-6.5 flex flex-col gap-6.75'>
      <div className='flex flex-col gap-3.5'>
        <div className='flex flex-col gap-1.75'>
          <h2 className='text-h2 text-fg'>Sessions</h2>
          <p className='text-body-s text-muted'>{weekSessionCount} sessions over the next seven days</p>
        </div>
        <DateStrip acitive={active} setActive={setActive} comingSoon={movie.isComingSoon}/>
      </div>

      {sessions.length === 0 && !movie.isComingSoon ? (
        <p className='text-body-m text-muted'>No sessions on this day. Try another date.</p>
      ) : (
        sessions.map((v) => <VenueSessions key={v.venue.id} venue={v}/>)
      )}

      {
        movie.isComingSoon && (
          <div className='h-full flex flex-col gap-2 items-center justify-center'>
            <h2 className='text-h2 text-warning'>Coming Soon...</h2>
            <p className='text-body-m text-muted'>This film has no sessions yet.</p>
          </div>
        )
      }
    </section>
  )
}

export default SessionsSection