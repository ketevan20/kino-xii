import { MovieDetail } from '@/types/api'
import Image from 'next/image'
import React from 'react'
import Badge from '../ui/Badge'

const MovieHero = ({ movie }: { movie: MovieDetail }) => {
  return (
    <div className='relative w-full h-[min(567px,100vh)] overflow-hidden'>
      {
        movie.backdropUrl && (
          <Image
            src={movie.backdropUrl}
            alt=''
            fill
            priority
            sizes='100vw'
            className='object-[50%_15%] object-cover blur-xs'
          />
        )
      }


      <div className='absolute left-15 bottom-10.25 flex gap-8.5'>
        <div className='relative w-72.25 h-93.5 rounded-[14px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.2)]'>
          {movie.posterUrl && (
            <Image
              src={movie.posterUrl}
              alt={`${movie.title} poster`}
              fill
              priority
              sizes='224px'
              className='object-cover'
            />
          )}
        </div>
        <div className='self-end flex flex-col gap-3.75 max-w-145'>
          <Badge variant='brand' className='uppercase'>{movie.isComingSoon ? 'Coming Soon' : 'Now Playing'}</Badge>
          <h1 className='text-display text-fg uppercase'>{movie.title}</h1>
          <p className='text-body-m text-fg'>{movie.synopsis}</p>
          <div className='flex gap-1.75'>
              <Badge variant='brand'>{movie.ageRating.code}</Badge>
              <Badge icon='/Timer.svg'>{movie.runtimeMinutes} Min</Badge>
              {movie.formats.map(f => <Badge key={f.id}>{f.name}</Badge>)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieHero