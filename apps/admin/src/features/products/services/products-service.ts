import {
	type Brand,
	type Category,
	type Product,
	type ProductImage,
	ProductInsertBody,
	ProductUpdateBody,
} from "@renovabit/db/schema";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { api } from "@/libs/eden-client/eden-client";
import { handleEdenError } from "@/libs/eden-client/utils";

/** Producto con relaciones (brand, category, images) tal como lo devuelve la API */
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

export type ProductsListResult = {
	data: ProductWithRelations[];
	total: number;
};

export async function fetchProducts(
	params: ProductListParams = {},
): Promise<ProductsListResult> {
	const res = await api.api.v1.products.get({
		query: {
			categoryId: params.categoryId,
			brandId: params.brandId,
			featured: params.featured,
			includeInactive: params.includeInactive,
			limit: params.limit ?? 20,
			offset: params.offset ?? 0,
		},
	});

	if (res.error || !res.data) {
		handleEdenError(res, "Error al cargar productos");
	}

	const raw = res.data as { data?: ProductWithRelations[]; total?: number };
	const data = Array.isArray(raw?.data) ? raw.data : [];
	const total = typeof raw?.total === "number" ? raw.total : data.length;
	return { data, total };
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
}): Promise<void> {
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
	// @ts-ignore - The types need to propagate from the updated controller
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
		queryKey: ["products", params],
		queryFn: () => fetchProducts(params),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 5,
	});

export const productQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["products", id],
		queryFn: () => fetchProduct(id),
		enabled: !!id,
	});
