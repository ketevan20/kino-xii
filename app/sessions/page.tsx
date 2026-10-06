import SessionFilters from '@/components/sessions/SessionFilters';
import SessionsResults from '@/components/sessions/SessionsResults';
import { getFilterOptions } from '@/lib/api/filterOptions';
import { getSessions } from '@/lib/api/sessions';
import { getNextDays, parseSessionsQuery, toURLSearchParams } from '@/lib/filters';

type PageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const page = async ({ searchParams }: PageProps) => {
    const params = toURLSearchParams(await searchParams);
    const options = await getFilterOptions();
    const query = parseSessionsQuery(params, options);
    const days = getNextDays(7);
    const date = query.date ?? days[0].key;
    const { data, meta } = await getSessions({ ...query, date });

    return (
        <main className='mt-29.25 px-12.75 flex flex-col gap-9 relative mb-34'>
            <div className='flex flex-col gap-1.5'>
                <h1 className='text-h1 text-fg'>Sessions</h1>
                <p className='text-body-m text-muted'>Browse showtimes across all venues</p>
            </div>
            <div className='grid items-start gap-12.75 grid-cols-[320px_minmax(0,1fr)]'>
                <SessionFilters days={days} selectedDate={date} query={query}/>
                <div>
                    <SessionsResults data={data} meta={meta.totalSessions} />
                </div>
            </div>
        </main>
    );
}

export default page