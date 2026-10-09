"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getRecent, type RecentMovie } from "@/lib/recentlyViewed";
import Badge from "../ui/Badge";

export default function RecentlyViewed() {
  const [movies, setMovies] = useState<RecentMovie[]>([]);

  useEffect(() => {
    setMovies(getRecent());
  }, []);

  if (movies.length === 0) return null;

  return (
    <section className="w-full flex flex-col gap-5 px-17.5">
      <h1 className='text-h1 text-fg'>Recently viewed</h1>

      <div className="relative w-full">
        <div className="flex gap-5 items-center overflow-x-scroll scrollbar-none">
          {
            movies.map(movie => (
              <Link href={`/movies/${movie.slug}`} key={movie.id} className="w-82.25 shrink-0 flex gap-3 p-2.5 rounded-2xl bg-card border border-transparent  hover:border-elevated">
                <div className='relative w-21.75 '>
                  {
                    movie.posterUrl && (
                      <Image
                        src={movie.posterUrl}
                        fill
                        alt={movie.title}
                        loading='eager'
                        className='object-cover rounded-lg'
                      />
                    )
                  }
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-button text-fg'>{movie.title}</p>
                  <p className='text-muted text-body-s'>{movie.genres?.[0]?.name} · {movie.runtimeMinutes}min</p>
                  <Badge variant='brand'>{movie.ageRating.code}</Badge>
                </div>
              </Link>
            ))
          }
        </div>
      <div className='pointer-events-none absolute inset-y-0 right-0 z-10 w-45 bg-linear-to-l from-page to-transparent' />
      </div>
    </section>
  );
}