'use client'
import { useFilterOptions } from '@/providers/FilterOptionsProvider'
import React from 'react'
import FilterCheckbox from './FilterCheckbox'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrayKey, availableFormats, clearFilters, DayOption, setParam, toggleFilter } from '@/lib/filters'
import { SessionsQuery } from '@/lib/api/sessions'

const FilterContainer = ({ title, children }: { title: string, children: React.ReactNode }) => {
  return (
    <div className='pb-6 border-b border-elevated flex flex-col gap-3'>
      <p className='text-muted text-overline uppercase'>{title}</p>
      {children}
    </div>
  )
}

const SessionFilters = ({ days, selectedDate, query }: { days: DayOption[]; selectedDate: string, query: SessionsQuery }) => {
  const options = useFilterOptions()
  // !!!
  const { venues, formats, languages, timeBands } = options 
  const router = useRouter()
  const params = new URLSearchParams(useSearchParams().toString())

  const selected: Record<ArrayKey, string[]> = {
    venues: query.venues ?? [],
    formats: query.formats ?? [],
    languages: query.languages ?? [],
    bands: query.bands ?? [],
  }

  const activeCount = Object.values(selected).flat().length

  const shownFormats = availableFormats(options, selected.venues)

  const go = (next: URLSearchParams) => router.push(`?${next}`, { scroll: false })
  const toggle = (key: ArrayKey, value: string) =>
    go(toggleFilter(params, key, value, options))

  return (
    <div className='sticky bg-card rounded-2xl p-6 flex flex-col justify-between'>
      <div className='flex flex-col gap-6'>
        <h3 className='text-h3 text-fg'>Filters</h3>
        <FilterContainer title='Venue'>
          <div className='flex flex-col gap-3'>
            {venues.map(v => (
              <FilterCheckbox key={v.id} label={v.name} hint={v.city} checked={selected.venues.includes(v.slug)} onChange={() => toggle('venues', v.slug)} />
            ))}
          </div>
        </FilterContainer>

        <FilterContainer title='date'>
          <div className='relative flex gap-1.5 overflow-x-auto scrollbar-none'>
            {days.map(({ key, weekday, day }) => {
              const active = key === selectedDate
              return (
                <button
                  key={key}
                  type='button'
                  aria-pressed={active}
                  onClick={() => { !active ? go(setParam(params, 'date', key)) : "" }}
                  className={`w-9.25 h-13.5 shrink-0 rounded-lg px-1.5 text-center text-label-s flex flex-col gap-1.5 items-center justify-center ${active ? 'bg-brand text-fg' : 'bg-elevated text-fg hover:bg-card'}`}
                >
                  <span>{weekday}</span>
                  <span>{day}</span>
                </button>
              )
            })}
          </div>
        </FilterContainer>

        <FilterContainer title='format'>
          <div className='flex flex-col gap-3'>
            {shownFormats.map(f => (
              <FilterCheckbox key={f.id} label={f.name} checked={selected.formats.includes(f.slug)} onChange={() => toggle('formats', f.slug)} />
            ))}
          </div>
        </FilterContainer>

        <FilterContainer title='language'>
          <div className='flex flex-col gap-3'>
            {languages.map(l => (
              <FilterCheckbox key={l.id} label={l.name} checked={selected.languages.includes(l.slug)} onChange={() => toggle('languages', l.slug)} />
            ))}
          </div>
        </FilterContainer>
        <FilterContainer title='time of day'>
          <div className='flex flex-col gap-3'>
            {timeBands.map(t => (
              <FilterCheckbox key={t.id} label={t.label.split(" ")[0]} hint={t.label.split(" ").slice(1, 4).join(" ")} checked={selected.bands.includes(t.id)} onChange={() => toggle('bands', t.id)} />
            ))}
          </div>
        </FilterContainer>
      </div>

      <div className='flex flex-col items-center gap-3 pt-6'>
        <button
          type='button'
          disabled={activeCount === 0}
          onClick={() => go(clearFilters(params))}
          className='w-full py-2.25 rounded-full border border-muted text-label-s text-fg disabled:opacity-0'
        >
          Clear filters
        </button>
        <p className='text-body-s text-muted'>{activeCount} filters active</p>
      </div>
    </div>
  )
}

export default SessionFilters