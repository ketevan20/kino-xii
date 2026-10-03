"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getRecent, type RecentMovie } from "@/lib/recentlyViewed";

export default function RecentlyViewed() {
  const [movies, setMovies] = useState<RecentMovie[]>([]);

  useEffect(() => {
    setMovies(getRecent());
  }, []);

  if (movies.length === 0) return null; 

  return (
    <section>
      
    </section>
  );
}