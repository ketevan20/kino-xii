"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { searchMovies } from "@/lib/api/movies";
import { useDebounce } from "@/lib/hooks/useDebounce";
import type { Movie } from "@/types/api";

const HighlightMatch = ({ text, query }: { text: string; query: string }) => {
    const q = query.trim()
    if (!q) return <>{text}</>

    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'))

    return (
        <>
            {parts.map((part, i) =>
                i % 2 === 1 ? (
                    <span key={i} className="text-fg">{part}</span>
                ) : (
                    part
                )
            )}
        </>
    )
}

const movieHref = (m: Movie) => (`/movies/${m.slug}`);

export default function SearchBar() {
    const router = useRouter();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Movie[]>([]);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const debounced = useDebounce(query, 300);

    const showDropdown = open && query.trim() !== "";

    useEffect(() => {
        const q = debounced.trim();
        if (!q) {
            setResults([]);
            return;
        }

        const controller = new AbortController();
        searchMovies(q, controller.signal)
            .then(setResults)
            .catch((e) => {
                if (e.name !== "AbortError") setResults([]);
            });

        return () => controller.abort();
    }, [debounced]);

    useEffect(() => {
        setActiveIndex(-1);
    }, [results]);

    useEffect(() => {
        function onPointerDown(e: MouseEvent) {
            if (!wrapperRef.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", onPointerDown);
        return () => document.removeEventListener("mousedown", onPointerDown);
    }, []);

    useEffect(() => {
        if (activeIndex < 0) return;
        document
            .getElementById(`search-option-${activeIndex}`)
            ?.scrollIntoView({ block: "nearest" });
    }, [activeIndex]);

    function reset() {
        setQuery("");
        setResults([]);
        setActiveIndex(-1);
        inputRef.current?.focus();
    }

    function go(m: Movie) {
        setOpen(false);
        setActiveIndex(-1);
        router.push(movieHref(m));
    }

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Escape") {
            if (showDropdown) setOpen(false);
            else if (query) reset();
            inputRef.current?.blur()
            return;
        }

        if (e.key === "ArrowDown" && query.trim() && !open) {
            e.preventDefault();
            setOpen(true);
            return;
        }

        if (!showDropdown || results.length === 0) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setActiveIndex((i) => (i + 1) % results.length);
                break;
            case "ArrowUp":
                e.preventDefault();
                setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
                break;
            case "Enter":
                if (activeIndex >= 0) {
                    e.preventDefault();
                    go(results[activeIndex]);
                }
                break;
        }
    }

    function emptySearch({ icon, label, text }: { icon: string, label: string, text: string }) {
        return (
            <div className="hidden group-focus-within:flex absolute right-0 top-full z-50 mt-1.25 w-120 h-67.5 bg-page p-2 items-center justify-center flex-col gap-5 border border-elevated rounded-2xl">
                <div className="w-12 h-12 bg-fg/10 flex items-center justify-center rounded-full">
                    <img src={icon} alt="" />
                </div>
                <div className="flex flex-col gap-1.5 text-center">
                    <p className="text-fg text-label-m">{label}</p>
                    <p className="text-muted text-body-m">{text}</p>
                </div>
                <Link
                    href="/sessions"
                    onClick={() => setOpen(false)}
                    className="text-button text-fg rounded-full px-5.5 py-3.25 bg-fg/10"
                >
                    Browse all sessions
                </Link>
            </div>
        )
    }

    return (
        <div
            ref={wrapperRef}
            className="group relative flex w-95 items-center gap-1 rounded-full border border-transparent bg-fg/10 px-3 py-1.5 transition-[width,border-color,background-color,backdrop-filter] duration-300 ease-out hover:border-fg/10 focus-within:border-fg/10 focus-within:w-120 focus-within:bg-fg/15 focus-within:backdrop-blur-sm"
        >
            <img
                src="/search.svg"
                alt="search icon"
                className={`block size-3.5 shrink-0 ${query ? '' : 'group-focus-within:hidden'}`}
            />
            <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={onKeyDown}
                placeholder="Search films and live events"
                role="combobox"
                aria-expanded={showDropdown}
                aria-controls="search-results"
                aria-autocomplete="list"
                aria-activedescendant={activeIndex >= 0 ? `search-option-${activeIndex}` : undefined}
                className="w-full bg-transparent text-fg outline-none placeholder:text-fg placeholder:text-body-m focus:placeholder:text-subtle"
            />

            {query && (
                <button type="button" onClick={reset} aria-label="Clear search">
                    <img src="/Clear.svg" alt="" />
                </button>
            )}

            { !query && emptySearch({ icon: "/boxicons_popcorn.svg", label: "What do you want to watch?", text: "Search by title, director or cast" }) }

            {showDropdown && (
                results.length === 0 ? emptySearch({icon: '/search.svg', label: `No results for “${query}”`, text: 'Check the spelling or try another film or live event.'}) : (
                    <ul
                        id="search-results"
                        role="listbox"
                        className="hidden group-focus-within:flex absolute right-0 top-full z-50 mt-1.25 w-120 bg-page p-2 flex-col gap-0.5 border border-elevated rounded-2xl"
                    >
                        <li role="presentation" className="flex justify-between px-2.5 pt-2 pb-1.5 text-muted">
                            <p className="text-overline">FILMS & EVENTS</p>
                            <p className="text-body-s">{results.length} results</p>
                        </li>

                        {results.map((m, i) => (
                            <li
                                key={m.id}
                                id={`search-option-${i}`}
                                role="option"
                                aria-selected={i === activeIndex}
                            >
                                <Link
                                    href={movieHref(m)}
                                    onClick={() => setOpen(false)}
                                    onMouseEnter={() => setActiveIndex(i)}
                                    tabIndex={-1}
                                    className={`rounded-[10px] pl-2.5 pr-5 py-2 flex gap-3.5 items-center ${i === activeIndex ? 'bg-fg/10' : ''}`}
                                >
                                    <div className="relative w-10 h-14 shrink-0">
                                        {m.posterUrl && (
                                            <Image src={m.posterUrl} alt="" fill sizes="40px" className="object-cover rounded-md" />
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col gap-0.75">
                                        <p className="text-label-m text-muted">
                                            <HighlightMatch text={m.title} query={query} />
                                        </p>
                                        <p className="text-body-s text-muted">
                                            <span className="capitalize">{m.kind}</span> · {m.ageRating.code} · {m.runtimeMinutes}min
                                        </p>
                                    </div>
                                    <p className={`text-label-m ${m.isComingSoon ? 'text-warning' : 'text-fg'}`}>
                                        {m.isComingSoon ? 'Coming Soon' : `from ₾${m.fromPrice}`}
                                    </p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )
            )}
        </div>
    );
}