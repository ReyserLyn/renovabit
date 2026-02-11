import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { Brand } from "@/features/brands/model/brand-model";
import { Category } from "@/features/categories/model/category-model";
import type {
	Product,
	ProductImage,
	ProductInsertBody,
	ProductUpdateBody,
} from "@/features/products/models/product-model";
import { api } from "@/libs/eden-client/eden-client";
import { handleEdenError } from "@/libs/eden-client/utils";

export const productsKeys = {
	all: ["products"] as const,
	list: (params: ProductListParams) => ["products", params] as const,
	detail: (id: string) => ["products", id] as const,
};

export type ProductWithRelations = Product & {
	images: ProductImage[];
	brand: Brand | null;
	category: Category | null;
};

export type ProductListFilters = {
	categoryId?: string;
	brandId?: string;
	featured?: boolean;
	includeInactive?: boolean;
};

export type ProductListParams = ProductListFilters & {
	limit?: number;
	offset?: number;
};

export async function fetchProducts(params: ProductListParams = {}) {
	const includeInactive = params.includeInactive ?? true;
	const res = await api.api.v1.products.get({
		query: {
			categoryId: params.categoryId,
			brandId: params.brandId,
			featured: params.featured,
			includeInactive,
			limit: params.limit,
			offset: params.offset,
		},
	});

	if (res.error || !res.data) {
		handleEdenError(res, "Error al cargar productos");
	}

	return res.data;
}

export async function fetchProduct(id: string) {
	const res = await api.api.v1.products({ id }).get();

	if (res.status === 404) return null;
	if (res.error || !res.data) {
		handleEdenError(res, "Error al cargar producto");
	}

	return res.data;
}

export async function validateProduct(params: {
	id?: string;
	slug: string;
	sku: string;
}) {
	const res = await api.api.v1.products.validate.post(params);

	if (res.error || !res.data) {
		handleEdenError(res, "Error en la validación del producto.");
	}
}

export async function createProduct(body: ProductInsertBody) {
	const res = await api.api.v1.products.post(body);

	if (res.error || !res.data) {
		handleEdenError(res, "Error al crear producto");
	}

	return res.data;
}

export async function updateProduct(id: string, body: ProductUpdateBody) {
	const res = await api.api.v1.products({ id }).put(body);

	if (res.error || !res.data) {
		handleEdenError(res, "Error al actualizar producto");
	}

	return res.data;
}

export async function deleteProduct(id: string) {
	const res = await api.api.v1.products({ id }).delete();

	if (res.error || res.status !== 200) {
		handleEdenError(res, "Error al eliminar producto");
	}
}

export async function bulkDeleteProducts(ids: string[]) {
	const res = await api.api.v1.products.bulk.delete({ ids });

	if (res.error || res.status !== 200) {
		handleEdenError(res, "Error al eliminar productos");
	}
}

export const productsQueryOptions = (params: ProductListParams) =>
	queryOptions({
		queryKey: productsKeys.list(params),
		queryFn: () => fetchProducts(params),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 5,
	});

export const productQueryOptions = (id: string) =>
	queryOptions({
		queryKey: productsKeys.detail(id),
		queryFn: () => fetchProduct(id),
		enabled: !!id,
	});
