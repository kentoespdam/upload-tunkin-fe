"use client";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { memo, useEffect, useMemo, useState } from "react";
import LoadingTable from "@/components/commons/loading-table";
import PaginationBuilder from "@/components/commons/pageable";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn, formatRupiah, getUrut } from "@/lib/utils";
import type { PageResponse } from "@/tipes/commons";
import { type Tunkin, tunkinTableHeders } from "@/tipes/tunkin";
import { fetchTunkin } from "./action";

// Types
type TunkinTableBodyProps = {
	data: PageResponse<Tunkin>;
	className?: string;
	style?: React.CSSProperties;
};

type TunkinRow = Tunkin & { urut: number };

// Constants
const TABLE_MIN_HEIGHT = 411;
const ROW_ANIM_DELAY_MS = 40;

// Custom hook untuk data fetching
const useTunkinData = () => {
	const params = useSearchParams();
	const paramsString = params.toString();

	const { data, isLoading, isFetching } = useQuery({
		queryKey: ["tunkin", paramsString],
		queryFn: () => fetchTunkin(paramsString),
		enabled: !!params.get("periode"),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	return {
		data,
		isLoading,
		isFetching,
		paramsString,
	};
};

// Table Body Component
const TunkinTableBody = memo(({ data, className, style }: TunkinTableBodyProps) => {
	const rows = useMemo((): TunkinRow[] => {
		const urut = getUrut(data);
		return data.content.map((row, index) => ({
			...row,
			urut: urut + index,
		}));
	}, [data]);

	return (
		<TableBody className={className} style={style}>
			{rows.map((row, index) => (
				<TunkinTableRow key={row.id} row={row} index={index} />
			))}
		</TableBody>
	);
});
TunkinTableBody.displayName = "TunkinTableBody";

// Individual Table Row Component
const TunkinTableRow = memo(({ row, index }: { row: TunkinRow; index: number }) => {
	return (
		<TableRow
			className={cn("odd:bg-muted hover:bg-primary/15 animate-row")}
			style={{ animationDelay: `${index * ROW_ANIM_DELAY_MS}ms` }}
		>
			<TableCell className="border" align="right" width={30}>
				{row.urut}
			</TableCell>
			<TableCell className="border">{row.periode}</TableCell>
			<TableCell className="border">{row.nipam}</TableCell>
			<TableCell className="border">{row.nama}</TableCell>
			<TableCell className="border">{row.jabatan}</TableCell>
			<TableCell className="border">{row.organisasi}</TableCell>
			<TableCell className="border" align="center">
				<Badge variant={"outline"}>{row.status_pegawai}</Badge>
			</TableCell>
			<TableCell className="border" align="right">
				{formatRupiah(row.nominal)}
			</TableCell>
		</TableRow>
	);
});
TunkinTableRow.displayName = "TunkinTableRow";

// Table Header Component
const TunkinTableHeader = memo(() => {
	return (
		<TableHeader>
			<TableRow>
				{tunkinTableHeders.map((column) => (
					<TableHead
						key={column.id}
						align={column.align || "center"}
						className="bg-primary text-primary-foreground border text-center text-nowrap"
					>
						{column.title}
					</TableHead>
				))}
			</TableRow>
		</TableHeader>
	);
});
TunkinTableHeader.displayName = "TunkinTableHeader";

// Main Component
const TunkinComponent = memo(() => {
	const { data, isLoading, isFetching } = useTunkinData();

	const showLoading = isLoading || isFetching;
	const isDataEmpty = !data || data.is_empty;

	// Presence-managed mount/unmount crossfade between loading and data views
	const PRESENCE_EXIT_MS = 180;
	const [currentView, setCurrentView] = useState<"loading" | "data">(
		isDataEmpty ? "loading" : "data",
	);
	const [isSwapping, setIsSwapping] = useState(false);

	useEffect(() => {
		const nextView = isDataEmpty ? "loading" : "data";
		if (nextView !== currentView) {
			setIsSwapping(true);
			const t = setTimeout(() => {
				setCurrentView(nextView);
				setIsSwapping(false);
			}, PRESENCE_EXIT_MS);
			return () => clearTimeout(t);
		}
	}, [isDataEmpty, currentView]);

	return (
		<div className="grid gap-2">
			<div className="overflow-auto" style={{ minHeight: TABLE_MIN_HEIGHT }}>
				<Table className="border animate-table-mount">
					<TunkinTableHeader />

					{currentView === "data" ? (
						<TunkinTableBody
							data={data as PageResponse<Tunkin>}
							className={cn(isSwapping ? "presence-exit" : "presence-enter")}
						/>
					) : (
						<LoadingTable
							columns={tunkinTableHeders}
							showLoading={showLoading}
							className={cn(isSwapping ? "presence-exit" : "presence-enter")}
						/>
					)}
				</Table>
			</div>

			<PaginationBuilder data={data} />
		</div>
	);
});

TunkinComponent.displayName = "TunkinComponent";

export default TunkinComponent;
