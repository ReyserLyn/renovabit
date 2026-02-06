import {
	parseAsBoolean,
	parseAsInteger,
	parseAsString,
	useQueryStates,
} from "nuqs";

const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 25, 30, 40, 50] as const;

/** Filtros en URL por slug (categoría y marca) para URLs legibles y compartibles */
export const productFiltersParsers = {
	category: parseAsString.withDefault(""),
	brand: parseAsString.withDefault(""),
	includeInactive: parseAsBoolean.withDefault(true),
	page: parseAsInteger.withDefault(0),
	pageSize: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
} as const;

export type ProductFiltersState = {
	category: string;
	brand: string;
	includeInactive: boolean;
	page: number;
	pageSize: number;
};

export function useProductFilters() {
	return useQueryStates(productFiltersParsers, {
		history: "push",
		shallow: false,
	});
}

/** Tamaño de página válido para la API (clamp a opciones permitidas) */
function getValidPageSize(size: number): number {
	return PAGE_SIZE_OPTIONS.includes(size as (typeof PAGE_SIZE_OPTIONS)[number])
		? size
		: DEFAULT_PAGE_SIZE;
}

/** Parámetros base para la lista (slugs); la página resuelve slug → id para la API */
export function getProductListParamsFromFilters(filters: ProductFiltersState): {
	category: string;
	brand: string;
	includeInactive: boolean;
	limit: number;
	offset: number;
} {
	const limit = getValidPageSize(filters.pageSize);
	return {
		category: filters.category || "",
		brand: filters.brand || "",
		includeInactive: filters.includeInactive,
		limit,
		offset: filters.page * limit,
	};
}

export { DEFAULT_PAGE_SIZE as PAGE_SIZE };
