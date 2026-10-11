import SessionsLoader from '@/components/sessions/SessionsLoader';
import SessionsSkeleton from '@/components/sessions/SessionsSkeleton';
import { getFilterOptions } from '@/lib/api/filterOptions';
import { getNextDays, parseSessionsQuery, toURLSearchParams } from '@/lib/filters';
import { Suspense } from 'react';

type PageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const page = async ({ searchParams }: PageProps) => {
    const params = toURLSearchParams(await searchParams);
    const options = await getFilterOptions();
    const query = parseSessionsQuery(params, options);
    const days = getNextDays(7);
    const date = query.date ?? days[0].key;

    return (
        <div>
            <Suspense key={JSON.stringify({ ...query, date })} fallback={<SessionsSkeleton />}>
                <SessionsLoader query={query} date={date} />
            </Suspense>
        </div>
    );
}

export default page