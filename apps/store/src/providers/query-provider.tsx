"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from "@/lib/api/client";

/** QueryClient para cliente (useState). Recibe prefetch del servidor vía HydrationBoundary. */
export function Providers({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: DEFAULT_STALE_TIME,
						gcTime: DEFAULT_GC_TIME,
						refetchOnWindowFocus: false,
						retry: 1,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools initialIsOpen={false} />
			{children}
		</QueryClientProvider>
	);
}
