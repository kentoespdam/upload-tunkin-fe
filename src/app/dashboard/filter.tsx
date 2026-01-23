"use client";

import { ChevronDown, ChevronUp, Filter, RotateCcw } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { ActiveFilters } from "@/components/dashboard/active-filters";
import FilterFields from "@/components/dashboard/filter-fields";
import { Button } from "@/components/ui/button";
import { useTunkinFilter } from "@/hooks/use-tunkin-filter";
import { cn } from "@/lib/utils";
import TunkinFormDialog from "./form-dialog";

const TunkinFilterComponent = () => {
	const {
		periode,
		nipam,
		nama,
		orgId,
		handleInputChange,
		handleSelectChange,
		clearFilters,
		hasActiveFilters,
		activeFilterCount,
	} = useTunkinFilter();

	const [showFilters, setShowFilters] = useState(true);
	const filterRef = useRef<HTMLDivElement>(null);

	const toggleFilters = useCallback(() => {
		setShowFilters((prev) => !prev);
	}, []);

	// Close filters when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				filterRef.current &&
				!filterRef.current.contains(event.target as Node)
			) {
				// Optional: close on outside click
				// setShowFilters(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div
			ref={filterRef}
			className="sticky top-0 z-10 bg-linear-to-b from-background/95 to-background/90 backdrop-blur supports-backdrop-filter:bg-linear-to-b supports-backdrop-filter:from-background/60 supports-backdrop-filter:to-background/50 border-b shadow-sm"
		>
			<div className="container mx-auto px-4 py-4">
				{/* Filter Header */}
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
					{/* Filter Toggle Button */}
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={toggleFilters}
						className="gap-2 w-fit font-medium hover:bg-primary/10"
					>
						<Filter className="h-4 w-4" />
						Filter Pencarian
						{showFilters ? (
							<ChevronUp className="h-4 w-4 transition-transform duration-300" />
						) : (
							<ChevronDown className="h-4 w-4 transition-transform duration-300" />
						)}
					</Button>

					{/* Right Actions */}
					<div className="flex items-center gap-2">
						{hasActiveFilters && (
							<div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-200">
								<span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
								<span className="text-xs font-semibold text-amber-700">
									{activeFilterCount} filter aktif
								</span>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={clearFilters}
									className="h-6 px-2 text-xs text-amber-700 hover:bg-amber-100"
								>
									<RotateCcw className="h-3 w-3 mr-1" />
									Bersihkan
								</Button>
							</div>
						)}
						<TunkinFormDialog />
					</div>
				</div>

				{/* Filter Fields - Expandable Section */}
				<div
					className={cn(
						"grid transition-all duration-300 ease-in-out overflow-hidden",
						showFilters
							? "grid-rows-[1fr] opacity-100 mt-4"
							: "grid-rows-[0fr] opacity-0 pointer-events-none",
					)}
				>
					<div className="overflow-hidden">
						<FilterFields
							periode={periode}
							nipam={nipam}
							nama={nama}
							orgId={orgId}
							onInputChange={handleInputChange}
							onSelectChange={handleSelectChange}
						/>
					</div>
				</div>

				{/* Active Filters Display */}
				<ActiveFilters
					periode={periode}
					nipam={nipam}
					nama={nama}
					orgId={orgId}
					hasActiveFilters={hasActiveFilters}
					onFilterChange={handleSelectChange}
					onInputChange={handleInputChange}
				/>
			</div>
		</div>
	);
};

export default memo(TunkinFilterComponent);
