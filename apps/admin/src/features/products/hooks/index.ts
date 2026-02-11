import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useBrands } from "@/features/brands/hooks";
import { useCategories } from "@/features/categories/hooks";
import { ProductUpdateBody } from "../models/product-model";
import type { ProductFiltersState } from "../parsers/product-filters";
import {
	getProductListParamsFromFilters,
	useProductFilters,
} from "../parsers/product-filters";
import type { ProductListParams } from "../services/products-service";
import {
	bulkDeleteProducts,
	createProduct,
	deleteProduct,
	productsKeys,
	updateProduct,
} from "../services/products-service";

export function useCreateProduct() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: productsKeys.all });
		},
	});
}

export function useUpdateProduct() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, body }: { id: string; body: ProductUpdateBody }) =>
			updateProduct(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: productsKeys.all });
		},
	});
}

export function useDeleteProduct() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: productsKeys.all });
		},
	});
}

export function useBulkDeleteProducts() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (ids: string[]) => bulkDeleteProducts(ids),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: productsKeys.all });
		},
	});
}

export type ProductListParamsResult = {
	listParams: ProductListParams;
	filters: ProductFiltersState;
	setFilters: ReturnType<typeof useProductFilters>[1];
	categories: { id: string; name: string; slug: string }[];
	brands: { id: string; name: string; slug: string }[];
};

/**
 * Filtros de producto desde URL + categorías y marcas cargadas.
 * Resuelve slugs (category, brand) a IDs para la API.
 * Devuelve también setFilters para paginación y otros controles que actualicen la URL.
 */
export function useProductListParams(): ProductListParamsResult {
	const [filters, setFilters] = useProductFilters();
	const { data: categoriesRaw = [] } = useCategories(true);
	const { data: brandsRaw = [] } = useBrands(true);

	const categories = Array.isArray(categoriesRaw) ? categoriesRaw : [];
	const brands = Array.isArray(brandsRaw) ? brandsRaw : [];

	const listParams = useMemo((): ProductListParams => {
		const base = getProductListParamsFromFilters(filters);
		const categoryId = base.category
			? categories.find((c) => c.slug === base.category)?.id
			: undefined;
		const brandId = base.brand
			? brands.find((b) => b.slug === base.brand)?.id
			: undefined;
		return {
			categoryId,
			brandId,
			includeInactive: base.includeInactive,
			limit: base.limit,
			offset: base.offset,
		};
	}, [filters, categories, brands]);

	return { listParams, filters, setFilters, categories, brands };
}
