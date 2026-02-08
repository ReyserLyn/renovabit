import { queryOptions } from "@tanstack/react-query";
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from "@/lib/api/client";
import { api } from "@/lib/api/eden";
import { apiCall } from "@/lib/api/errors";

export async function fetchBrands() {
	return apiCall(api.api.v1.brands.get());
}

export const brandsQueryOptions = queryOptions({
	queryKey: ["brands"],
	queryFn: fetchBrands,
	staleTime: DEFAULT_STALE_TIME,
	gcTime: DEFAULT_GC_TIME,
});
