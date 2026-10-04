import { api } from "./client";
import type { DataWrapper, Movie, MovieWithSynopsis, MovieDetail } from "@/types/api";

export const getNowPlaying = () =>
  api<DataWrapper<MovieWithSynopsis[]>>("/movies/now-playing").then((r) => r.data);

export const getComingSoon = () =>
  api<DataWrapper<MovieWithSynopsis[]>>("/movies/coming-soon").then((r) => r.data);

export const getFeatured = () =>
  api<DataWrapper<MovieWithSynopsis[]>>("/movies/featured").then((r) => r.data);

export const getMovie = (slug: string) =>
  api<DataWrapper<MovieDetail>>(`/movies/${slug}`).then((r) => r.data);

export const searchMovies = (q: string, signal?: AbortSignal) =>
  api<DataWrapper<Movie[]>>(`/search?q=${encodeURIComponent(q)}`, { signal }).then(
    (r) => r.data
  );