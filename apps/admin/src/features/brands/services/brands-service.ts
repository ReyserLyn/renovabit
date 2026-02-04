import { BrandInsertBody, BrandUpdateBody } from "@renovabit/db/schema";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { api } from "@/libs/eden-client/eden-client";
import { handleEdenError } from "@/libs/eden-client/utils";

export async function fetchBrands(includeInactive: boolean) {
	const res = await api.api.v1.brands.get({
		query: includeInactive ? { includeInactive: true } : undefined,
	});

	if (res.error || !res.data) {
		handleEdenError(res, "Error al cargar marcas");
	}

	return res.data;
}

export async function fetchBrand(id: string) {
	const res = await api.api.v1.brands({ id }).get();

	if (res.status === 404) return null;
	if (res.error || !res.data) {
		handleEdenError(res, "Error al cargar marca");
	}

	return res.data;
}

export async function createBrand(body: BrandInsertBody) {
	const res = await api.api.v1.brands.post(body);

	if (res.error || !res.data) {
		handleEdenError(res, "Error al crear marca");
	}

	return res.data;
}

export async function updateBrand(id: string, body: BrandUpdateBody) {
	const res = await api.api.v1.brands({ id }).put(body);

	if (res.error || !res.data) {
		handleEdenError(res, "Error al actualizar marca");
	}

	return res.data;
}

export async function deleteBrand(id: string) {
	const res = await api.api.v1.brands({ id }).delete();

	if (res.error || res.status !== 200) {
		handleEdenError(res, "Error al eliminar marca");
	}
}

export async function bulkDeleteBrands(ids: string[]) {
	const res = await api.api.v1.brands.bulk.delete({ ids });

	if (res.error || res.status !== 200) {
		handleEdenError(res, "Error al eliminar marcas");
	}
}

export async function validateBrand(body: {
	id?: string;
	name?: string;
	slug?: string;
}) {
	const res = await api.api.v1.brands.validate.post(body);

	if (res.error) {
		handleEdenError(res, "Datos de marca no válidos");
	}

	return res.data;
}

export const brandsQueryOptions = (includeInactive: boolean) =>
	queryOptions({
		queryKey: ["brands", { includeInactive }],
		queryFn: () => fetchBrands(includeInactive),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 5,
	});

export const brandQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["brands", id],
		queryFn: () => fetchBrand(id),
		enabled: !!id,
	});
