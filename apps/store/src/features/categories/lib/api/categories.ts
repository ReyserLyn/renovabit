import { queryOptions } from "@tanstack/react-query";
import {
	DEFAULT_GC_TIME,
	DEFAULT_STALE_TIME,
	LONG_STALE_TIME,
} from "@/lib/api/client";
import { api } from "@/lib/api/eden";
import { apiCall } from "@/lib/api/errors";

export async function fetchCategories() {
	return apiCall(api.api.v1.categories.get());
}

export async function fetchCategoriesNavbar() {
	return apiCall(api.api.v1.categories.navbar.get());
}

export const categoriesQueryOptions = queryOptions({
	queryKey: ["categories"],
	queryFn: fetchCategories,
	staleTime: DEFAULT_STALE_TIME,
	gcTime: DEFAULT_GC_TIME,
});

export const categoriesNavbarQueryOptions = queryOptions({
	queryKey: ["categories", "navbar"],
	queryFn: fetchCategoriesNavbar,
	staleTime: LONG_STALE_TIME,
	gcTime: DEFAULT_GC_TIME,
});
