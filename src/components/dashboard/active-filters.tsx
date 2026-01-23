import { Building2, Calendar, Grid3x3, User, Zap } from "lucide-react";
import { memo, useMemo } from "react";
import { FilterBadge } from "./filter-badge";

interface ActiveFiltersProps {
    periode: string;
    nipam: string;
    nama: string;
    orgId: string;
    hasActiveFilters: boolean;
    onFilterChange: (id: string, value: string) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FILTER_ICONS = {
    periode: Calendar,
    nipam: Grid3x3,
    nama: User,
    orgId: Building2,
};

const FILTER_VARIANTS = {
    periode: "primary" as const,
    nipam: "secondary" as const,
    nama: "info" as const,
    orgId: "primary" as const,
};

export const ActiveFilters = memo(
    ({
        periode,
        nipam,
        nama,
        orgId,
        hasActiveFilters,
        onFilterChange,
        onInputChange,
    }: ActiveFiltersProps) => {
        const filters = useMemo(
            () => [
                { id: "periode", value: periode, label: "Periode" },
                { id: "nipam", value: nipam, label: "NIPAM" },
                { id: "nama", value: nama, label: "Nama" },
                { id: "orgId", value: orgId, label: "Organisasi" },
            ],
            [periode, nipam, nama, orgId],
        );

        const activeFilters = useMemo(
            () => filters.filter((f) => f.value),
            [filters],
        );

        if (!hasActiveFilters) return null;

        return (
            <div className="mt-4 pt-4 border-t animate-in fade-in-0 slide-in-from-top-2">
                <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {activeFilters.length} filter aktif
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {activeFilters.map(({ id, value, label }) => {
                        const Icon = FILTER_ICONS[id as keyof typeof FILTER_ICONS];
                        const variant = FILTER_VARIANTS[id as keyof typeof FILTER_VARIANTS];

                        return (
                            <FilterBadge
                                key={id}
                                label={label}
                                value={value}
                                icon={Icon && <Icon className="h-3.5 w-3.5" />}
                                variant={variant}
                                onRemove={() => {
                                    if (id === "orgId") {
                                        onFilterChange(id, "");
                                    } else {
                                        onInputChange({
                                            target: { id, value: "" },
                                        } as unknown as React.ChangeEvent<HTMLInputElement>);
                                    }
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        );
    },
);

ActiveFilters.displayName = "ActiveFilters";
