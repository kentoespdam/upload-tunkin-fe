"use client";

import { memo, useMemo } from "react";
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
import type { OrganizationMini } from "@/tipes/organization";
import { type Tunkin, tunkinTableHeders } from "@/tipes/tunkin";
import { useFilterContext } from "./filter-provider";

// Types
type TunkinTableBodyProps = {
	data: PageResponse<Tunkin>;
	className?: string;
	style?: React.CSSProperties;
};

type TunkinRow = Tunkin & { urut: number };

// Constants
const ROW_ANIM_DELAY_MS = 40;

// Table Body Component
const TunkinTableBody = memo(
	({ data, className, style }: TunkinTableBodyProps) => {
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
	},
);
TunkinTableBody.displayName = "TunkinTableBody";

// Individual Table Row Component
const TunkinTableRow = memo(
	({ row, index }: { row: TunkinRow; index: number }) => {
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
					{formatRupiah(row.tunkin)}
				</TableCell>
				<TableCell className="border" align="right">
					{formatRupiah(row.pph21_ter)}
				</TableCell>
			</TableRow>
		);
	},
);
TunkinTableRow.displayName = "TunkinTableRow";

// Table Header Component
const TunkinTableHeader = memo(() => {
	return (
		<TableHeader className="sticky top-0 z-10">
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
const TunkinComponent = memo(
	({
		orgs: _orgs,
		data,
	}: {
		orgs: OrganizationMini[];
		data: PageResponse<Tunkin>;
	}) => {
		const { isPending } = useFilterContext();
		const isDataEmpty = !data || data.is_empty;

		return (
			<div className="flex flex-col flex-1 min-h-0 min-w-0 gap-4">
				<div
					className={cn(
						"flex-1 min-h-0 overflow-auto relative transition-opacity duration-200 border rounded-md",
						isPending && "opacity-60 pointer-events-none",
					)}
				>
					<Table className="animate-table-mount">
						<TunkinTableHeader />

						{isDataEmpty ? (
							<LoadingTable columns={tunkinTableHeders} showLoading={false} />
						) : (
							<TunkinTableBody data={data} />
						)}
					</Table>
				</div>

				<div className="shrink-0">
					<PaginationBuilder data={data} />
				</div>
			</div>
		);
	},
);

TunkinComponent.displayName = "TunkinComponent";

export default TunkinComponent;
