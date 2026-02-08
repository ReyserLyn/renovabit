import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
	brandsQueryOptions,
	categoriesNavbarQueryOptions,
	categoriesQueryOptions,
} from "@/features";
import { getQueryClient } from "@/lib/api/client";
import { TestApiClient } from "./test-api-client";

export default async function TestApiPage() {
	const queryClient = getQueryClient();
	await Promise.all([
		queryClient.prefetchQuery(brandsQueryOptions),
		queryClient.prefetchQuery(categoriesNavbarQueryOptions),
		queryClient.prefetchQuery(categoriesQueryOptions),
	]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className="container mx-auto p-8">
				<h1 className="text-3xl font-bold mb-6">Test API Connection</h1>
				<TestApiClient />
			</div>
		</HydrationBoundary>
	);
}
