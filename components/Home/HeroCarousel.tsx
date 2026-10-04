'use client'
import { MovieWithSynopsis } from '@/types/api'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

const formatWeekOf = (iso: string) =>
  new Date(iso)
    .toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    .toUpperCase()

const AUTOPLAY_MS = 7000

const HeroCarousel = ({ movies }: { movies: MovieWithSynopsis[] }) => {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = movies.length

  const goTo = useCallback(
    (i: number) => setIndex(((i % count) + count) % count),
    [count]
  )

  useEffect(() => {
    if (paused || count < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [paused, count, index])

  if (count === 0) return null

  const chip =
    'inline-flex items-center gap-1 text-white rounded-full bg-[rgba(255,255,255,0.1)] px-3 py-[6px] text-label-s'

  return (
    <section className='w-full h-[min(760px,100vh)] relative'>
      {
        movies.map((movie, i) => {
          let active = i === index
          return (
            <div
              key={movie.id}
              aria-hidden={!active}
              className={`absolute inset-0 transition-opacity duration-700 ${active ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}>
              {movie.backdropUrl && (
                <Image
                  src={movie.backdropUrl}
                  alt=''
                  fill
                  priority={i === 0}
                  sizes='100vw'
                  className='object-cover object-center'
                />
              )}

              {/* Gradient overlays */}
              <div className='absolute inset-0 bg-linear-to-r from-black/70 via-black/20 to-transparent' />
              <div className='absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent' />

              <div className='absolute bottom-44.75 left-16.75 flex flex-col gap-3.75 max-w-145'>
                <div className='self-start bg-[rgba(236,48,19,0.1)] text-[rgba(236,48,19,1)] uppercase px-2.5 py-1.5 rounded-full text-label-s'>
                  {`Premiere · Week of ${formatWeekOf(movie.releaseDate)}`}
                </div>

                <h1 className='text-white text-display uppercase'>{movie.title}</h1>

                <div className='flex flex-wrap items-center gap-2'>
                  <span className={`${chip} bg-[rgba(236,48,19,0.1)]! text-[rgba(236,48,19,1)]!`}>
                    {movie.ageRating.minAge}+
                  </span>
                  <span className={chip}>
                    <img src='/Timer.svg' alt='timer icon' />
                    {movie.runtimeMinutes} Min
                  </span>
                  {movie.formats.map((format) => (
                    <span key={format.id} className={`${chip}`}>
                      {format.name}
                    </span>
                  ))}
                </div>

                <p className='text-body-m text-white'>
                  {movie.synopsis}
                </p>

                <div className='mt-1.25 flex items-center gap-2.5'>
                  <Link
                    href={`/movies/${movie.slug}`}
                    tabIndex={active ? 0 : -1}
                    className='inline-flex items-center gap-2 rounded-full bg-[rgba(236,48,19,1)] px-5.5 py-3.25 text-button text-white'
                  >
                    <img src='/ticket.svg' alt='buy ticket icon' />
                    Buy tickets
                  </Link>
                  <Link
                    href={`/sessions`}
                    tabIndex={active ? 0 : -1}
                    className='inline-flex items-center rounded-full bg-[rgba(255,255,255,0.1)] px-5.5 py-3.25 text-button text-white transition hover:bg-[rgba(169,169,169,1)]'
                  >
                    All sessions
                  </Link>
                </div>
              </div>

            </div>
          )
        })
      }

      {count > 1 && (
        <div className='absolute bottom-10.5 left-16.75 right-16.75 flex items-center gap-5'>
          <div className='flex flex-1 gap-1.75'>
            {movies.map((movie, i) => (
              <button
                key={movie.id}
                type='button'
                aria-label={`Go to ${movie.title}`}
                onClick={() => goTo(i)}
                className='group flex-1 py-2'
              >
                <span
                  className={`block h-0.75 w-full rounded-full transition-colors ${i === index
                    ? 'bg-[rgba(236,48,19,1)]'
                    : 'bg-[rgba(255,255,255,1)] group-hover:bg-white/70 group-hover:cursor-pointer'
                    }`}
                />
              </button>
            ))}
          </div>

          <div className='flex gap-2.5'>
            <button
              type='button'
              aria-label='Previous'
              onClick={() => goTo(index - 1)}
              className='grid w-13.5 h-13.5 place-items-center rounded-full bg-[#070C1C]/20 hover:bg-[#070C1C] text-white  transition'
            >
              <img src='arrow.svg' alt='next icon' className='-scale-x-100'/>
            </button>
            <button
              type='button'
              aria-label='Next'
              onClick={() => goTo(index + 1)}
              className='grid w-13.5 h-13.5 place-items-center rounded-full bg-[#070C1C]/20 hover:bg-[#070C1C] text-white transition'
            >
              <img src='arrow.svg' alt='next icon'/>
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default HeroCarousel