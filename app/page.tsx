import HeroCarousel from "@/components/Home/HeroCarousel";
import MoviesGrid from "@/components/Home/MoviesGrid";
import RecentlyViewed from "@/components/Home/RecentlyViewed";
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
      <div className='divide-y divide-[rgba(42,44,61,1)] *:py-10 [&>*:first-child]:pt-0 [&>*:last-child]:pb-0'>
        <RecentlyViewed />
        <MoviesGrid movies={nowPlaying} title="Now Playing" />
        <MoviesGrid movies={comingSoon} title="Comming Soon..." />
      </div>
    </div>
  );
}