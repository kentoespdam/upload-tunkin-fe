"use client";
import LoadingTable from "@/components/commons/loading-table";
import PaginationBuilder from "@/components/commons/pageable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, getUrut } from "@/lib/utils";
import type { PageResponse } from "@/tipes/commons";
import { type Tunkin, tunkinTableHeders } from "@/tipes/tunkin";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { memo, useMemo } from "react";
import { fetchTunkin } from "./action";

// Types
type TunkinTableBodyProps = { 
  data: PageResponse<Tunkin>;
};

type TunkinRow = Tunkin & { urut: number };

// Constants
const TABLE_MIN_HEIGHT = 411;

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
const TunkinTableBody = memo(({ data }: TunkinTableBodyProps) => {
  const rows = useMemo((): TunkinRow[] => {
    const urut = getUrut(data);
    return data.content.map((row, index) => ({
      ...row,
      urut: urut + index,
    }));
  }, [data]);

  return (
    <TableBody>
      {rows.map((row) => (
        <TunkinTableRow key={row.id} row={row} />
      ))}
    </TableBody>
  );
});
TunkinTableBody.displayName = "TunkinTableBody";

// Individual Table Row Component
const TunkinTableRow = memo(({ row }: { row: TunkinRow }) => {
  return (
    <TableRow className={cn("odd:bg-muted hover:bg-primary/15")}>
      <TableCell className="border" align="right" width={30}>
        {row.urut}
      </TableCell>
      <TableCell className="border">{row.periode}</TableCell>
      <TableCell className="border">{row.nipam}</TableCell>
      <TableCell className="border">{row.nama}</TableCell>
      <TableCell className="border">{row.jabatan}</TableCell>
      <TableCell className="border">{row.organisasi}</TableCell>
      <TableCell className="border">{row.status_pegawai}</TableCell>
      <TableCell className="border">{row.nominal}</TableCell>
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

  return (
    <div className="grid gap-2">
      <div className="overflow-auto" style={{ minHeight: TABLE_MIN_HEIGHT }}>
        <Table className="border">
          <TunkinTableHeader />
          
          {!isDataEmpty ? (
            <TunkinTableBody data={data} />
          ) : (
            <LoadingTable
              columns={tunkinTableHeders}
              showLoading={showLoading}
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