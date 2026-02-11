import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	CategoryInsertBody,
	CategoryUpdateBody,
} from "../model/category-model";
import {
	bulkDeleteCategories,
	categoriesKeys,
	categoriesQueryOptions,
	categoryQueryOptions,
	createCategory,
	deleteCategory,
	updateCategory,
} from "../services/categories-service";

export function useCategories(includeInactive = true) {
	return useQuery(categoriesQueryOptions(includeInactive));
}

export function useCategory(id: string) {
	return useQuery(categoryQueryOptions(id));
}

export function useCreateCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: CategoryInsertBody) => createCategory(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
		},
	});
}

export function useUpdateCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, body }: { id: string; body: CategoryUpdateBody }) =>
			updateCategory(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
		},
	});
}

export function useDeleteCategory() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteCategory(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
		},
	});
}

export function useBulkDeleteCategories() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (ids: string[]) => bulkDeleteCategories(ids),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: categoriesKeys.all });
		},
	});
}
