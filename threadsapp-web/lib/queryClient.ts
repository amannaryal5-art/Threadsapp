import { QueryClient } from "@tanstack/react-query";
import { QUERY_STALE_TIME } from "@/lib/constants";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME,
        refetchOnWindowFocus: false,
        retry: 1
      },
      mutations: {
        retry: 0
      }
    }
  });
}
