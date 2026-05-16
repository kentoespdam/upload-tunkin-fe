import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDebounceCallback } from "./use-debounce-callback";

const FILTER_FIELDS = {
	PERIODE: "periode",
	SEARCH: "search",
	ORG_ID: "orgId",
} as const;

const PAGINATION_FIELDS = ["page", "size"] as const;

export interface FilterValues {
	periode: string;
	search: string;
	orgId: string;
}

export const useTunkinFilter = (
	startTransition?: React.TransitionStartFunction,
) => {
	const params = useSearchParams();
	const { replace } = useRouter();
	const paramsRef = useRef(params);

	useEffect(() => {
		paramsRef.current = params;
	}, [params]);

	const filterValues = useMemo<FilterValues>(
		() => ({
			periode: params.get(FILTER_FIELDS.PERIODE) ?? "",
			search: params.get(FILTER_FIELDS.SEARCH) ?? "",
			orgId: params.get(FILTER_FIELDS.ORG_ID) ?? "",
		}),
		[params],
	);

	const replaceUrl = useCallback(
		(field: string, value: string) => {
			const search = new URLSearchParams(paramsRef.current);

			// Reset pagination when filter changes (except for pagination fields)
			if (
				!PAGINATION_FIELDS.includes(field as (typeof PAGINATION_FIELDS)[number])
			) {
				PAGINATION_FIELDS.forEach((paginationField) => {
					search.delete(paginationField);
				});
			}

			// Remove or set the filter value
			if (!value.trim()) {
				search.delete(field);
			} else {
				search.set(field, value);
			}

			const update = () => replace(`?${search.toString()}`);

			if (startTransition) {
				startTransition(update);
			} else {
				update();
			}
		},
		[replace, startTransition],
	);

	const debounceSearch = useDebounceCallback(replaceUrl, 600);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const { id, value } = e.target;
			debounceSearch(id, value);
		},
		[debounceSearch],
	);

	const handleSelectChange = useCallback(
		(id: string, value: string) => {
			debounceSearch(id, value);
		},
		[debounceSearch],
	);

	const clearFilters = useCallback(() => {
		const search = new URLSearchParams(paramsRef.current);
		Object.values(FILTER_FIELDS).forEach((field) => {
			search.delete(field);
		});
		PAGINATION_FIELDS.forEach((field) => {
			search.delete(field);
		});
		replace(`?${search.toString()}`);
	}, [replace]);

	const activeFilterCount = useMemo(() => {
		return Object.values(filterValues).filter((value) => value.trim() !== "")
			.length;
	}, [filterValues]);

	const hasActiveFilters = activeFilterCount > 0;

	return {
		...filterValues,
		handleInputChange,
		handleSelectChange,
		clearFilters,
		hasActiveFilters,
		activeFilterCount,
		FILTER_FIELDS,
	};
};
