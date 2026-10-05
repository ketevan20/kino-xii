import { api } from "./client";
import type { DataWrapper, FilterOptions } from "@/types/api";

export const getFilterOptions = () =>
    api<DataWrapper<FilterOptions>>("/filter-options", {
        next: { revalidate: 3600 },
    }).then((r) => r.data);