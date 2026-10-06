import { MovieWithSynopsis } from '@/types/api'
import Link from 'next/link'
import React from 'react'
import NowPlayingCard from './NowPlayingCard'
import CommingSoonCard from './ComingSoonCard'

const MoviesGrid = ({ movies, title }: { movies: MovieWithSynopsis[], title: string }) => {
    return (
        <section className='w-full flex flex-col gap-6 px-17.5'>
            <div className='flex justify-between'>
                <h1 className='text-h1 uppercase text-fg'>{title}</h1>
                <Link href={'/sessions'} className='self-baseline-last text-label-m text-brand hover:underline'>
                    See all
                </Link>
            </div>
            <div className='relative w-full'>
                <div className={`w-full flex ${title === "Now Playing" ? 'gap-4.25' : 'gap-5'} overflow-x-scroll scrollbar-none`}>
                    {
                        movies.slice(0, 10).map((movie) => {
                            if(title === "Now Playing" ) return <NowPlayingCard key={movie.id} movie={movie} />
                            if(title === "Coming Soon..." ) return <CommingSoonCard key={movie.id} movie={movie} />
                        })
                    }
                </div>
                <div className='pointer-events-none absolute inset-y-0 right-0 z-10 w-45 bg-linear-to-l from-page to-transparent' />
            </div>
        </section>
    )
}

export default MoviesGrid