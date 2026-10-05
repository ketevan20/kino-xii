import HeroCarousel from "@/components/home/HeroCarousel";
import MoviesGrid from "@/components/home/MoviesGrid";
import RecentlyViewed from "@/components/home/RecentlyViewed";
import { getFeatured, getNowPlaying, getComingSoon } from "@/lib/api/movies";

export default async function Home() {
  const [featured, nowPlaying, comingSoon] = await Promise.all([
    getFeatured(),
    getNowPlaying(),
    getComingSoon(),
  ]);

  return (
    <div className='w-full h-full flex flex-col gap-8'>
      <HeroCarousel movies={featured} />
      <div className='divide-y divide-elevated *:py-10 [&>*:first-child]:pt-0 [&>*:last-child]:pb-0'>
        <RecentlyViewed />
        <MoviesGrid movies={nowPlaying} title="Now Playing" />
        <MoviesGrid movies={comingSoon} title="Coming Soon..." />
      </div>
    </div>
  );
}