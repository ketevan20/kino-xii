import type { Movie } from "@/types/api";

const KEY = "kino:recentlyViewed";
const MAX = 10;

export type RecentMovie = Pick<Movie, "id" | "slug" | "title" | "posterUrl" | "ageRating" | "genres" | "runtimeMinutes">;

export function getRecent(): RecentMovie[] {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function addRecent(movie: RecentMovie) {
    try {
        const list = getRecent().filter((m) => m.id !== movie.id);
        list.unshift(movie);
        localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
    } catch {
    }
}