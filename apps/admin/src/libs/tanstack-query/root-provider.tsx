import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClientDefaultOptions = {
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			staleTime: 1000 * 60, // 1 minuto
			gcTime: 1000 * 60 * 10, // 10 min
		},
	},
} as const;

export function getContext() {
	const queryClient = new QueryClient(queryClientDefaultOptions);
	return {
		queryClient,
	};
}

export function Provider({
	children,
	queryClient,
}: {
	children: React.ReactNode;
	queryClient: QueryClient;
}) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
