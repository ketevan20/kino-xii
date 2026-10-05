import TrackRecentlyViewed from '@/components/home/TrackRecentlyViewed';
import MovieHero from '@/components/movie/MovieHero';
import MovieInfoSidebar from '@/components/movie/MovieInfoSidebar';
import SessionsSection from '@/components/movie/SessionsSection';
import { ApiError } from '@/lib/api/errors';
import { getMovie, getMovieSessions } from '@/lib/api/movies';
import { getDateOffset, getToday } from '@/lib/date';
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

    const today = getToday();
    const weekEnd = getDateOffset(6);

    const requestedDate = date ?? today;
    const selectedDate =
        !movie.isComingSoon && movie.availableDates.includes(requestedDate)
            ? requestedDate
            : null;

    const weekDates = movie.availableDates.filter((d) => d >= today && d <= weekEnd);

    const weekSessions = movie.isComingSoon
        ? []
        : await Promise.all(
            weekDates.map(async (d) => ({ date: d, venues: await getMovieSessions(slug, d) }))
        );

    const venues = weekSessions.find((w) => w.date === selectedDate)?.venues ?? [];

    const weekSessionCount = weekSessions
        .flatMap((w) => w.venues)
        .reduce((acc, curr) => acc + curr.sessions.length, 0);


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