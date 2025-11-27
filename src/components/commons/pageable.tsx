"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  usePathname,
  useRouter,
  useSearchParams
} from "next/navigation";
import { memo, useCallback, useMemo } from "react";
import type { PageResponse } from "@/tipes/commons";
import { Button } from "../ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem
} from "../ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// Constants
const PAGE_SIZES = [10, 25, 50, 100] as const;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

// Types
interface PaginationButtonProps {
  page: number;
  path: string;
  params: string;
}

interface NavigationButtonProps extends PaginationButtonProps {
  isDisabled: boolean;
}

// Custom hook untuk URL management
const useURLManager = () => {
  const pathname = usePathname();
  const params = useSearchParams();
  const { replace } = useRouter();

  const createURL = useCallback((updates: Record<string, string>) => {
    const searchParams = new URLSearchParams(params);
    Object.entries(updates).forEach(([key, value]) => {
      searchParams.set(key, value);
    });
    return `${pathname}?${searchParams.toString()}`;
  }, [pathname, params]);

  const navigateToURL = useCallback((url: string) => {
    replace(url);
  }, [replace]);

  return { createURL, navigateToURL, params, pathname };
};

// Custom hook untuk pagination data
const usePaginationData = (data?: PageResponse<unknown>) => {
  return useMemo(() => {
    if (!data) {
      return {
        is_first: true,
        is_last: true,
        page: DEFAULT_PAGE,
        total_pages: 0,
      };
    }
    
    const { is_first, is_last, page, total_pages } = data;
    return { is_first, is_last, page, total_pages };
  }, [data]);
};

// Previous Button Component
const PreviousButton = memo(({ 
  isDisabled, 
  page, 
}: NavigationButtonProps) => {
  const { createURL, navigateToURL } = useURLManager();

  const handleClick = useCallback(() => {
    const url = createURL({ page: String(page - 1) });
    navigateToURL(url);
  }, [createURL, navigateToURL, page]);

  if (isDisabled) return null;

  return (
    <PaginationItem>
      <Button
        variant="ghost"
        onClick={handleClick}
        aria-label="Go to previous page"
        size="default"
        className="gap-1 px-2.5 sm:pl-2.5 cursor-pointer"
      >
        <ChevronLeftIcon />
        <span className="hidden sm:block">Previous</span>
      </Button>
    </PaginationItem>
  );
});
PreviousButton.displayName = "PreviousButton";

// Next Button Component
const NextButton = memo(({ 
  isDisabled, 
  page, 
}: NavigationButtonProps) => {
  const { createURL, navigateToURL } = useURLManager();

  const handleClick = useCallback(() => {
    const url = createURL({ page: String(page + 1) });
    navigateToURL(url);
  }, [createURL, navigateToURL, page]);

  if (isDisabled) return null;

  return (
    <PaginationItem>
      <Button
        variant="ghost"
        aria-label="Go to next page"
        size="default"
        className="gap-1 px-2.5 sm:pr-2.5 cursor-pointer"
        onClick={handleClick}
      >
        <span className="hidden sm:block">Next</span>
        <ChevronRightIcon />
      </Button>
    </PaginationItem>
  );
});
NextButton.displayName = "NextButton";

// Pagination Size Component
const PaginationSize = memo(() => {
  const { createURL, navigateToURL, params } = useURLManager();

  const currentSize = useMemo(() => {
    return params.get("size") || String(DEFAULT_PAGE_SIZE);
  }, [params]);

  const handleSizeChange = useCallback((size: string) => {
    const url = createURL({ size, page: "1" }); // Reset ke page 1 ketika size berubah
    navigateToURL(url);
  }, [createURL, navigateToURL]);

  return (
    <PaginationItem className="flex gap-2 items-center">
      <span className="text-sm whitespace-nowrap">Page Size:</span>
      <Select
        value={currentSize}
        onValueChange={handleSizeChange}
      >
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZES.map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </PaginationItem>
  );
});
PaginationSize.displayName = "PaginationSize";

// Page List Component
const PageList = memo(({ 
  page, 
  total_pages 
}: { 
  page: number; 
  total_pages: number; 
}) => {
  const { createURL, navigateToURL } = useURLManager();

  const pageNumbers = useMemo(() => {
    return Array.from({ length: total_pages }, (_, index) => index + 1);
  }, [total_pages]);

  const handlePageChange = useCallback((newPage: string) => {
    const url = createURL({ page: newPage });
    navigateToURL(url);
  }, [createURL, navigateToURL]);

  if (total_pages <= 1) return null;

  return (
    <PaginationItem>
      <Select
        value={String(page)}
        onValueChange={handlePageChange}
      >
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {pageNumbers.map((pageNumber) => (
            <SelectItem key={pageNumber} value={String(pageNumber)}>
              {pageNumber}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </PaginationItem>
  );
});
PageList.displayName = "PageList";

// Total Pages Display
const TotalPages = memo(({ total_pages }: { total_pages: number }) => {
  return (
    <PaginationItem>
      <Button disabled size="sm" variant="ghost" className="whitespace-nowrap">
        Total: {total_pages}
      </Button>
    </PaginationItem>
  );
});
TotalPages.displayName = "TotalPages";

// Main Pagination Component
const PaginationBuilder = ({ data }: { data?: PageResponse<unknown> }) => {
  const paramsString = useSearchParams().toString();
  const { is_first, is_last, page, total_pages } = usePaginationData(data);

  // Jangan render pagination jika hanya ada 1 page atau tidak ada data
  if (total_pages <= 1 && !data) {
    return null;
  }


  return (
    <Pagination className="justify-end">
      <PaginationContent className="flex-wrap gap-2">
        <PaginationSize />
        
        <PreviousButton
          isDisabled={is_first}
          page={page}
          path={""}
          params={paramsString}
        />
        
        <PageList page={page} total_pages={total_pages} />
        
        <NextButton
          isDisabled={is_last}
          page={page}
          path={""}
          params={paramsString}
        />
        
        <TotalPages total_pages={total_pages} />
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationBuilder;