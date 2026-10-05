import { MovieDetail } from '@/types/api'
import React from 'react'

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className='w-97.25 flex flex-col gap-1.75'>
    <dt className='text-label-s text-muted uppercase'>{label}</dt>
    <dd className='text-label-m text-fg'>{children}</dd>
  </div>
)

const MovieInfoSidebar = ({ movie }: { movie: MovieDetail }) => {
  return (
    <aside className='px-6.5 flex flex-col gap-4.25'>
      <h2 className='text-h2 text-fg'>Details</h2>
      {movie.director && <Row label='Director'>{movie.director}</Row>}
      {movie.cast && <Row label='MAIN CAST'>{movie.cast}</Row>}
      <Row label='Duration'>{movie.runtimeMinutes} minutes</Row>
      <Row label='Release date'>
        {new Date(movie.releaseDate).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </Row>
      <Row label='Formats'>{movie.formats.map((f) => f.name).join(', ')}</Row>
      <Row label='From'>₾{movie.fromPrice}</Row>

      <div className='px-3.25 py-2.25 flex flex-col gap-1.75 bg-warning/10 rounded-xl text-warning text-label-s'>
        <p>RATING NOTE </p>
        <div className='flex gap-2.25'>
          <p>{movie.ageRating.code}</p>
          <p className='text-body-s'>{movie.ageRating.description}</p>
        </div>
      </div>
    </aside>
  )
}

export default MovieInfoSidebar