"use client";

import { createContext, useContext } from "react";
import type { FilterOptions } from "@/types/api";

const FilterOptionsContext = createContext<FilterOptions | null>(null);

export function FilterOptionsProvider({value,children}: { value: FilterOptions; children: React.ReactNode; }) {
    return (
        <FilterOptionsContext.Provider value={value}>
            {children}
        </FilterOptionsContext.Provider>
    );
}

export function useFilterOptions() {
    const ctx = useContext(FilterOptionsContext);
    if (!ctx) throw new Error("useFilterOptions must be used inside FilterOptionsProvider");
    return ctx;
}