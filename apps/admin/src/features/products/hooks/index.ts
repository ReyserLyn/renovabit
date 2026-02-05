import type { ProductUpdateBody } from "@renovabit/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	bulkDeleteProducts,
	createProduct,
	deleteProduct,
	updateProduct,
} from "../services/products-service";

export function useCreateProduct() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
	});
}

export function useUpdateProduct() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, body }: { id: string; body: ProductUpdateBody }) =>
			updateProduct(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
	});
}

export function useDeleteProduct() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
	});
}

export function useBulkDeleteProducts() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (ids: string[]) => bulkDeleteProducts(ids),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
	});
}
