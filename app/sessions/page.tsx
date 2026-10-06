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
        <main className='text-fg'>
            {meta.totalSessions}
        </main>
    );
}

export default page