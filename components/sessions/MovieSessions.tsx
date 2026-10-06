import { SessionGroup } from '@/types/api'
import Image from 'next/image'
import Link from 'next/link'
import Badge from '../ui/Badge'
import SessionTile from './SessionTile'

const MovieSessions = ({ session }: { session: SessionGroup }) => {
    return (
        <article className='flex flex-col gap-3.5'>
            <Link href={`movies/${session.movie.slug}`} className='flex gap-4 items-center'>
                <div className='relative h-20 w-14 shrink-0 overflow-hidden rounded-md bg-fg/10'>
                    {session.movie.posterUrl && (
                        <Image src={session.movie.posterUrl} alt='' fill sizes='50px' className='object-cover' />
                    )}
                </div>
                <div className='flex flex-col gap-3'>
                    <div className='flex gap-3 items-center'>
                        <h3 className='text-fg text-h3'>{session.movie.title}</h3>
                        <Badge variant='brand'>{session.movie.ageRating.code}</Badge>
                    </div>
                    <p className='text-muted text-body-m'>{session.movie.runtimeMinutes} min</p>
                </div>
            </Link>

            <div className='flex gap-3 overflow-x-auto scrollbar-none'>
                {
                    session.sessions.map((s) => (
                        <SessionTile key={s.id} session={s} />
                    ))
                }
            </div>
        </article>
    )
}

export default MovieSessions