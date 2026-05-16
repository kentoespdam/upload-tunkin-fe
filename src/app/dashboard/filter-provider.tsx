"use client";

import type React from "react";
import { createContext, useContext, useTransition } from "react";
import { useTunkinFilter } from "@/hooks/use-tunkin-filter";

type FilterContextType = ReturnType<typeof useTunkinFilter> & {
	isPending: boolean;
};

const FilterContext = createContext<FilterContextType | null>(null);

export function DashboardFilterProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isPending, startTransition] = useTransition();
	const filter = useTunkinFilter(startTransition);

	return (
		<FilterContext.Provider value={{ ...filter, isPending }}>
			{children}
		</FilterContext.Provider>
	);
}

export function useFilterContext() {
	const context = useContext(FilterContext);
	if (!context) {
		throw new Error(
			"useFilterContext must be used within a DashboardFilterProvider",
		);
	}
	return context;
}
