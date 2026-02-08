import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

export const API_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const DEFAULT_STALE_TIME = 60 * 1000;
export const DEFAULT_GC_TIME = 5 * 60 * 1000;
export const LONG_STALE_TIME = 60 * 60 * 1000;

/** QueryClient por request (React.cache); se reutiliza en el mismo request. */
export const getQueryClient = cache(() => {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: DEFAULT_STALE_TIME,
				gcTime: DEFAULT_GC_TIME,
				refetchOnWindowFocus: false,
				retry: 1,
				retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
			},
		},
	});
});
