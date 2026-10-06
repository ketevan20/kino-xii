import { MovieWithSynopsis } from '@/types/api'
import Image from 'next/image'
import Link from 'next/link'
import Badge from '../ui/Badge'

const NowPlayingCard = ({ movie }: { movie: MovieWithSynopsis }) => {
    return (
        <div className='group flex w-65 shrink-0 flex-col rounded-[20px] bg-card p-3.5 shadow-[0_1px_4px_0_rgba(0,0,0,0.25)] transition-[width] duration-400 ease-out hover:w-111.75'>
            <div className='relative mb-3 h-75 w-full shrink-0 overflow-hidden rounded-2xl bg-fg/5 transition-[height] duration-400 ease-out group-hover:h-56.25'>
                {movie.posterUrl && (
                    <Image
                        src={movie.posterUrl}
                        alt={`${movie.title} poster`}
                        fill
                        sizes='300px'
                        className='object-cover transition-opacity duration-400 group-hover:opacity-0'
                    />
                )}
                {movie.posterUrl && (
                    <Image
                        src={movie.posterUrl}
                        alt=''
                        fill
                        sizes='447px'
                        className='object-cover opacity-0 transition-opacity duration-400 group-hover:opacity-100'
                    />
                )}
            </div>

            <div className='flex flex-col gap-2 text-muted text-body-m'>
                <h1 className='text-h2 truncate text-fg'>{movie.title}</h1>
                <p>{movie.genres[0]?.name} · {movie.runtimeMinutes}min</p>
                <Badge variant='brand'>{movie.ageRating.code}</Badge>
            </div>

            <div className='mt-0.75 h-0 overflow-hidden text-muted text-body-m opacity-0 transition-[height,margin,opacity] duration-400 ease-out group-hover:mb-3 group-hover:mt-3 group-hover:h-13.5 group-hover:opacity-100'>
                <p className='line-clamp-3'>{movie.synopsis}</p>
            </div>

            <div className='flex items-center justify-between'>
                <p className='text-button text-fg'>From ₾ {movie.fromPrice}</p>
                <Link
                    href={`/movies/${movie.slug}`}
                    className='text-button rounded-full bg-brand px-5.5 py-2.5 text-fg transition hover:cursor-pointer'
                >
                    Buy Ticket
                </Link>
            </div>
        </div>
    )
}

export default NowPlayingCard