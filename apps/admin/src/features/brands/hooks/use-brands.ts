import { BrandInsertBody, BrandUpdateBody } from "@renovabit/db/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	brandQueryOptions,
	brandsKeys,
	brandsQueryOptions,
	bulkDeleteBrands,
	createBrand,
	deleteBrand,
	updateBrand,
} from "../services/brands-service";

export function useBrands(includeInactive = true) {
	return useQuery(brandsQueryOptions(includeInactive));
}

export function useBrand(id: string) {
	return useQuery(brandQueryOptions(id));
}

export function useCreateBrand() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: BrandInsertBody) => createBrand(body),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: brandsKeys.all });
		},
	});
}

export function useUpdateBrand() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, body }: { id: string; body: BrandUpdateBody }) =>
			updateBrand(id, body),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: brandsKeys.all });
		},
	});
}

export function useDeleteBrand() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteBrand(id),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: brandsKeys.all });
		},
	});
}

export function useBulkDeleteBrands() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids: string[]) => bulkDeleteBrands(ids),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: brandsKeys.all });
		},
	});
}
