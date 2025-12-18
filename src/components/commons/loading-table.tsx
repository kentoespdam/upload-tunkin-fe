"use client";
import type { ColumnDef } from "@/tipes/commons";
import { TableBody, TableCell, TableRow } from "../ui/table";

const LoadingTable = ({
	columns,
	showLoading,
}: {
	columns: ColumnDef[] | number;
	showLoading: boolean;
}) => {
	const columnsLength = Array.isArray(columns) ? columns.length : columns;

	return (
		<TableBody>
			<TableRow>
				<TableCell colSpan={columnsLength} align="center" className="font-bold">
					{showLoading ? "Loading..." : "No data available"}
				</TableCell>
			</TableRow>
		</TableBody>
	);
};

export default LoadingTable;
