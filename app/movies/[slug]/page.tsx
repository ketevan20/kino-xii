import TrackRecentlyViewed from '@/components/home/TrackRecentlyViewed';
import MovieHero from '@/components/movie/MovieHero';
import MovieInfoSidebar from '@/components/movie/MovieInfoSidebar';
import SessionsSection from '@/components/movie/SessionsSection';
import { ApiError } from '@/lib/api/errors';
import { getMovie, getMovieSessions } from '@/lib/api/movies';
import { MovieDetail } from '@/types/api';
import { notFound } from 'next/navigation';

type PageProps = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ date?: string }>
};

const page = async ({ params, searchParams }: PageProps) => {
    const { slug } = await params;
    const { date } = await searchParams;

    let movie: MovieDetail;

    try {
        movie = await getMovie(slug);
    } catch (e) {
        if (e instanceof ApiError && e.status === 404) notFound();
        throw e;
    }

    const selectedDate =
        date && movie.availableDates.includes(date) ? date : movie.availableDates[0];

    const venues =
        movie.isComingSoon || !selectedDate
            ? []
            : await getMovieSessions(slug, selectedDate);

    const end = new Date();
    end.setDate(end.getDate() + 6);
    const endStr = end.toISOString().slice(0, 10);
    const weekDates = movie.availableDates.filter((d) => d <= endStr);

    const weekSessionCount = movie.isComingSoon
        ? 0
        : (await Promise.all(weekDates.map((d) => getMovieSessions(slug, d))))
            .flat()
            .reduce((curr, acc) => curr + acc.sessions.length, 0);

    return (
        <main className='bg-page text-fg flex flex-col gap-8.5'>
            <TrackRecentlyViewed movie={movie} />

            <MovieHero movie={movie} />

            <div className='px-12.75 flex gap-2.5 mb-34'>
                <SessionsSection movie={movie} sessions={venues} weekSessionCount={weekSessionCount} />
                <MovieInfoSidebar movie={movie} />
            </div>
        </main>
    )
}

export default page