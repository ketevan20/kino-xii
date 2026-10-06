'use client'
import { ListSession } from '@/types/api'
import Badge from '../ui/Badge'
import Link from 'next/link';

const SessionTile = ({ session }: { session: ListSession }) => {
  const sessionDateTime = new Date(`${session.date}T${session.time}`);
  const isExpired = sessionDateTime <= new Date();
  const soldOut = session.seatsLeft ? false : true;
  const isExpiring = session.seatsLeft <= 5;

  return (
    <Link
      href={''}
      aria-disabled={isExpired || soldOut}
      tabIndex={isExpired || soldOut ? -1 : undefined}
      onClick={(event) => {
        if (isExpired || soldOut) {
          event.preventDefault()
          return
        }
      }}
      className={`bg-card rounded-2xl p-3.75 w-63 shrink-0  flex flex-col gap-3 ${isExpired || soldOut ? 'opacity-40 cursor-not-allowed' : 'opacity-100'}`}
    >
      <div className='flex justify-between items-center'>
        <h3 className='text-h3 text-fg'>{session.time}</h3>
        <Badge>{session.format.name}</Badge>
      </div>
      <div className='flex gap-2 justify-between'>
        <div className='flex flex-col gap-2.5'>
          <p className='text-body-s text-muted'>{session.language.name}</p>
          <p className='text-label-s text-fg'>{session.hall.venue.name} · Hall {session.hall.name}</p>
        </div>
        <div className='flex flex-col gap-2.5'>
          <div className={`${isExpired || soldOut ? 'text-muted' : isExpiring ? 'text-brand' : 'text-success'} text-body-s flex gap-1`}>
            {soldOut ? '' : isExpired ? '' :
              <span
                aria-hidden
                className='size-3 shrink-0 bg-current'
                style={{
                  maskImage: `url(/ticket.svg)`,
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  maskSize: 'contain',
                  WebkitMaskImage: `url(/ticket.svg)`,
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  WebkitMaskSize: 'contain',
                }}
              />
            }
            <p>{isExpired ? 'started' : soldOut ? 'Sold out' : `${session.seatsLeft} left`}</p>
          </div>
          <p className='text-button text-fg self-end'>₾{session.price}</p>
        </div>
      </div>
    </Link>
  )
}

export default SessionTile