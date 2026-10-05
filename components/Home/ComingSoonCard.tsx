import { MovieWithSynopsis } from '@/types/api'
import Image from 'next/image'
import React from 'react'
import Badge from '../ui/Badge'

const formatWeekOf = (iso: string) =>
    new Date(iso)
        .toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })


const CommingSoonCard = ({ movie }: { movie: MovieWithSynopsis }) => {
    return (
        <div className='w-117.5 shrink-0 flex gap-4.5 p-3.5 rounded-[20px] bg-card border border-transparent  hover:border-elevated shadow-[0_1px_4px_0_rgba(0,0,0,0.25)]'>
            <div className='relative w-34 '>
                {
                    movie.posterUrl && (
                        <Image
                            src={movie.posterUrl}
                            fill
                            alt={movie.title}
                            loading='eager'
                            className='object-cover rounded-[14px]'
                        />
                    )
                }
            </div>
            <div className='flex flex-col gap-2'>
                <p className='text-brand text-label-s uppercase'>in cinemas {formatWeekOf(movie.releaseDate)}</p>
                <p className='text-h3 text-fg'>{movie.title}</p>
                <p className='text-muted text-body-m'>{movie.genres[0]?.name} · {movie.runtimeMinutes}min</p>
                <Badge variant='brand'>{movie.ageRating.code}</Badge>
                <button className='self-start text-label-s text-fg rounded-full px-3 py-1.5 flex gap-1 items-center border border-muted hover:bg-fg/10'>
                    <img src="/notify.svg" alt="notify icon" />
                    Notify Me
                </button>
            </div>
        </div>
    )
}

export default CommingSoonCard