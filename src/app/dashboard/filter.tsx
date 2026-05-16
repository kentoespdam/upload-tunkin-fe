"use client";

import { ChevronDown, ChevronUp, Filter, RotateCcw } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { ActiveFilters } from "@/components/dashboard/active-filters";
import FilterFields from "@/components/dashboard/filter-fields";
import UploadTunkinDialog from "@/components/form/upload-tunkin-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OrganizationMini } from "@/tipes/organization";
import { useFilterContext } from "./filter-provider";

interface TunkinFilterProps {
	orgs: OrganizationMini[];
}

const TunkinFilterComponent = ({ orgs }: TunkinFilterProps) => {
	const {
		periode,
		search,
		orgId,
		handleInputChange,
		handleSelectChange,
		clearFilters,
		hasActiveFilters,
		activeFilterCount,
	} = useFilterContext();

	const [showFilters, setShowFilters] = useState(true);

	const toggleFilters = useCallback(() => {
		setShowFilters((prev) => !prev);
	}, []);

	return (
		<div className="shrink-0 bg-linear-to-b from-background/95 to-background/90 backdrop-blur supports-backdrop-filter:bg-linear-to-b supports-backdrop-filter:from-background/60 supports-backdrop-filter:to-background/50 border-b shadow-sm rounded-md">
			<div className="w-full px-4 py-4">
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
						<UploadTunkinDialog />
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
							search={search}
							orgId={orgId}
							orgs={orgs}
							onInputChange={handleInputChange}
							onSelectChange={handleSelectChange}
						/>
					</div>
				</div>

				{/* Active Filters Display */}
				<ActiveFilters
					periode={periode}
					search={search}
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
