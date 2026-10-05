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


    return (
        <main className='bg-page text-fg flex flex-col gap-8.5'>
            <MovieHero movie={movie} />

            <div className='px-12.75 flex gap-2.5'>
                <SessionsSection />
                <MovieInfoSidebar movie={movie}/>
            </div>
        </main>
    )
}

export default page