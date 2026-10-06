import type { FilterOptions, Format, TimeBand } from "@/types/api";
import type { SessionsQuery } from "@/lib/api/sessions";

type RawParams = Record<string, string | string[] | undefined>;
export type ArrayKey = "venues" | "formats" | "languages" | "bands";

const readList = (params: URLSearchParams, key: ArrayKey) =>
  (params.get(key) ?? "").split(",").filter(Boolean);

const writeList = (params: URLSearchParams, key: ArrayKey, values: string[]) => {
  if (values.length) params.set(key, values.join(","));
  else params.delete(key);
};
export function toURLSearchParams(raw: RawParams): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
    else if (value !== undefined) params.set(key, value);
  }
  return params;
}

export function availableFormats(options: FilterOptions, venueSlugs: string[]): Format[] {
  if (venueSlugs.length === 0) return options.formats;
  const allowed = new Set(
    options.venues
      .filter((v) => venueSlugs.includes(v.slug))
      .flatMap((v) => v.formats.map((f) => f.slug))
  );
  return options.formats.filter((f) => allowed.has(f.slug));
}

export function parseSessionsQuery(
  params: URLSearchParams,
  options: FilterOptions
): SessionsQuery {
  const pick = (key: ArrayKey, valid: string[]) =>
    readList(params, key).filter((v) => valid.includes(v));

  const venues = pick("venues", options.venues.map((v) => v.slug));
  const formatSlugs = availableFormats(options, venues).map((f) => f.slug);

  const date = params.get("date");
  const sort = params.get("sort");
  const page = Number(params.get("page"));

  return {
    date: date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined,
    venues,
    formats: pick("formats", formatSlugs),
    languages: pick("languages", options.languages.map((l) => l.slug)),
    bands: pick("bands", options.timeBands.map((b) => b.id)) as TimeBand[],
    search: params.get("search")?.trim() || undefined,
    sort: sort && options.sorts.some((s) => s.id === sort) ? sort : undefined,
    page: Number.isInteger(page) && page > 1 ? page : undefined,
  };
}


const clone = (params: URLSearchParams) => new URLSearchParams(params.toString());

export function toggleFilter(
  params: URLSearchParams,
  key: ArrayKey,
  value: string,
  options: FilterOptions
): URLSearchParams {
  const next = clone(params);
  const current = readList(next, key);
  const updated = current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
  writeList(next, key, updated);

  if (key === "venues") {
    const allowed = availableFormats(options, updated).map((f) => f.slug);
    writeList(next, "formats", readList(next, "formats").filter((s) => allowed.includes(s)));
  }

  next.delete("page"); 
  return next;
}

export function setParam(
  params: URLSearchParams,
  key: "date" | "sort" | "search",
  value?: string
): URLSearchParams {
  const next = clone(params);
  if (value) next.set(key, value);
  else next.delete(key);

  next.delete("page");
  return next;
}

export function setPage(params: URLSearchParams, page: number): URLSearchParams {
  const next = clone(params);
  if (page > 1) next.set("page", String(page));
  else next.delete("page");
  return next;
}