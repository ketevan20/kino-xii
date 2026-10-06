import SessionFilters from '@/components/sessions/SessionFilters';
import SessionsResults from '@/components/sessions/SessionsResults';
import { getFilterOptions } from '@/lib/api/filterOptions';
import { getSessions } from '@/lib/api/sessions';
import { parseSessionsQuery, toURLSearchParams } from '@/lib/filters';

type PageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const page = async ({ searchParams }: PageProps) => {
    const params = toURLSearchParams(await searchParams);
    console.log(params);
    const options = await getFilterOptions();
    const query = parseSessionsQuery(params, options);
    const { data, meta } = await getSessions(query);

    return (
        <main className='mt-29.25 px-12.75 flex flex-col gap-9'>
            <div className='flex flex-col gap-1.5'>
                <h1 className='text-h1 text-fg'>Sessions</h1>
                <p className='text-body-m text-muted'>Browse showtimes across all venues</p>
            </div>
            <div className='grid items-start gap-12.75 grid-cols-[320px_minmax(0,1fr)]'>
                <SessionFilters />
                <div>
                    <SessionsResults data={data} meta={meta.totalSessions} />
                </div>
            </div>
        </main>
    );
}

export default page