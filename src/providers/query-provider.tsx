"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

/**
 * Provider component that initializes and provides the TanStack Query client to the application.
 * Configures default options for queries such as staleTime and retry logic.
 *
 * @param props - Component props containing the children to be wrapped.
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Ensure we only create the client once per session
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Prevent aggressive refetching when switching browser tabs,
            // which makes QA testing much smoother and reduces backend load.
            refetchOnWindowFocus: false,
            // Keep data fresh for 1 minute before refetching behind the scenes
            staleTime: 60 * 1000,
            // Retry failed requests exactly once
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools only show up in development mode automatically */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
