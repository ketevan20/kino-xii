"use client";

import { useEffect } from "react";
import { addRecent } from "@/lib/recentlyViewed";
import type { MovieDetail } from "@/types/api";

export default function TrackRecentlyViewed({ movie }: { movie: MovieDetail }) {
  useEffect(() => {
    addRecent({
      id: movie.id,
      slug: movie.slug,
      title: movie.title,
      posterUrl: movie.posterUrl,
      ageRating: movie.ageRating,
      genres: movie.genres,
      runtimeMinutes: movie.runtimeMinutes
    });
  }, [movie.id]);

  return null;
}