export type BaseResponse<T>={
    status: number,
    data:T,
    message: string,
    errors?: string[]
    timestamp: string
    request_id: string
}

export type PageResponse<T> = {
  content: T[];
  total: number;
  is_empty: boolean;
  total_elements: number;
  is_first: boolean;
  is_last: boolean;
  page: number;
  page_size: number;
  total_pages: number;
};

export type ColumnDef = {
  id: string;
  title: string;
  width?: number;
  align?: "left" | "center" | "right";
};
