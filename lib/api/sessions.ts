import { api } from "./client";
import type { SessionsPage, TimeBand } from "@/types/api";

export interface SessionsQuery {
  date?: string;
  venues?: string[];      
  formats?: string[];
  languages?: string[];
  bands?: TimeBand[];
  search?: string;
  sort?: string;          
  page?: number;
}

export function buildSessionsQuery(q: SessionsQuery): string {
  const params = new URLSearchParams();

  if (q.date) params.set("date", q.date);
  if (q.search) params.set("search", q.search);
  if (q.sort) params.set("sort", q.sort);
  if (q.page && q.page > 1) params.set("page", String(q.page));

  q.venues?.forEach((v) => params.append("venues[]", v));
  q.formats?.forEach((v) => params.append("formats[]", v));
  q.languages?.forEach((v) => params.append("languages[]", v));
  q.bands?.forEach((v) => params.append("bands[]", v));

  return params.toString();
}

export const getSessions = (q: SessionsQuery = {}) => {
  const qs = buildSessionsQuery(q);
  return api<SessionsPage>(`/sessions${qs ? `?${qs}` : ""}`, {
    cache: "no-store", 
  });
};