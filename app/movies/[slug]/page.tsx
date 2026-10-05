import MovieHero from '@/components/movie/MovieHero';
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
        <main className='bg-page text-fg'>
            <MovieHero movie={movie} />

           
        </main>
    )
}

export default page