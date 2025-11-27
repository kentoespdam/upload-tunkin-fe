"use client"

import { QueryClient } from "@tanstack/react-query";
import QueryProvider from "@/components/template/query-provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
const Template = ({ children }: { children: React.ReactNode }) => {
  return <QueryProvider queryClient={queryClient}>{children}</QueryProvider>;
}

export default Template;