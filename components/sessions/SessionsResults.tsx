import { SessionGroup } from '@/types/api'
import React from 'react'
import MovieSessions from './MovieSessions'
import SortSelect from './SortSelect'

const SessionsResults = ({ data, meta }: { data: SessionGroup[], meta: number }) => {
    return (
        <section className='w-full flex flex-col gap-6 min-w-0'>
            <div className='w-full flex justify-between'>
                <p className='text-label-m text-fg'>Showing {meta} sessions</p>
                <SortSelect />
            </div>

            <div className='divide-y divide-elevated *:py-8 [&>*:first-child]:pt-0 [&>*:last-child]:pb-0'>
                {
                    data.map(el => (
                        <MovieSessions key={el.movie.id} session={el}/>
                    ))
                }
            </div>
        </section>
    )
}

export default SessionsResults