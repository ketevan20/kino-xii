import { MovieSession } from '@/types/api'
import Badge from '../ui/Badge'

const SessionCard = ({ session }: { session: MovieSession }) => {
  const sessionDateTime = new Date(`${session.date}T${session.time}`);
  const isExpired = sessionDateTime <= new Date();

  return (
    <div className={`w-51.75 bg-page flex rounded-xl overflow-hidden ${isExpired ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} `}>
      <div className='flex-1 w-31 p-3.75 flex flex-col gap-2 items-center justify-center'>
        <p className='text-h2 text-fg'>{session.time}</p>
        <p className='text-muted flex gap-1.5 items-center'><Badge className='opacity-70'>{session.format.name}</Badge></p>
      </div>

      <div className='relative w-px self-stretch'>
        <div className='absolute inset-y-3.5 left-0 w-px text-fg bg-[repeating-linear-gradient(to_bottom,currentColor_0_3px,transparent_3px_6px)]' />
        <span className='absolute left-1/2 top-0 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-card' />
        <span className='absolute bottom-0 left-1/2 size-5 -translate-x-1/2 translate-y-1/2 rounded-full bg-card' />
      </div>

      <div className='w-20.75 flex flex-col gap-1.5 items-center justify-center'>
        <p className='text-h3 text-brand'>₾{session.price}</p>
        <div className='text-muted flex items-center gap-1'>
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
          <span className='text-body-s'>{session.seatsLeft} left</span>
        </div>
        <p className='text-body-s text-muted'>{session.language.code}</p>
      </div>
    </div>
  )
}

export default SessionCard