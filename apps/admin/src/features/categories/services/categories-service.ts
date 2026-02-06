import { CategoryInsertBody, CategoryUpdateBody } from "@renovabit/db/schema";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { api } from "@/libs/eden-client/eden-client";
import { handleEdenError } from "@/libs/eden-client/utils";

export const categoriesKeys = {
	all: ["categories"] as const,
	list: (opts: { includeInactive: boolean }) => ["categories", opts] as const,
	detail: (id: string) => ["categories", id] as const,
};

export async function fetchCategories(includeInactive: boolean) {
	const res = await api.api.v1.categories.get({
		query: includeInactive ? { includeInactive: true } : undefined,
	});

	if (res.error || !res.data) {
		handleEdenError(res, "Error al cargar categorías");
	}

	return res.data;
}

export async function fetchCategory(id: string) {
	const res = await api.api.v1.categories({ id }).get();

	if (res.status === 404) return null;
	if (res.error || !res.data) {
		handleEdenError(res, "Error al cargar categoría");
	}

	return res.data;
}

export async function createCategory(body: CategoryInsertBody) {
	const res = await api.api.v1.categories.post(body);

	if (res.error || !res.data) {
		handleEdenError(res, "Error al crear categoría");
	}

	return res.data;
}

export async function updateCategory(id: string, body: CategoryUpdateBody) {
	const res = await api.api.v1.categories({ id }).put(body);

	if (res.error || !res.data) {
		handleEdenError(res, "Error al actualizar categoría");
	}

	return res.data;
}

export async function deleteCategory(id: string) {
	const res = await api.api.v1.categories({ id }).delete();

	if (res.error || res.status !== 200) {
		handleEdenError(res, "Error al eliminar categoría");
	}
}

export async function bulkDeleteCategories(ids: string[]) {
	const res = await api.api.v1.categories.bulk.delete({ ids });

	if (res.error || res.status !== 200) {
		handleEdenError(res, "Error al eliminar categorías");
	}
}

export async function validateCategory(body: {
	id?: string;
	name?: string;
	slug?: string;
}) {
	const res = await api.api.v1.categories.validate.post(body);

	if (res.error) {
		handleEdenError(res, "Datos de categoría no válidos");
	}

	return res.data;
}

export const categoriesQueryOptions = (includeInactive: boolean) =>
	queryOptions({
		queryKey: categoriesKeys.list({ includeInactive }),
		queryFn: () => fetchCategories(includeInactive),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 5,
	});

export const categoryQueryOptions = (id: string) =>
	queryOptions({
		queryKey: categoriesKeys.detail(id),
		queryFn: () => fetchCategory(id),
		enabled: !!id,
	});
