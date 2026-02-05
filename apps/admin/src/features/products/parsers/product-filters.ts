import {
	parseAsBoolean,
	parseAsInteger,
	parseAsString,
	useQueryStates,
} from "nuqs";

const PAGE_SIZE = 20;

/** Filtros en URL por slug (categoría y marca) para URLs legibles y compartibles */
export const productFiltersParsers = {
	category: parseAsString.withDefault(""),
	brand: parseAsString.withDefault(""),
	includeInactive: parseAsBoolean.withDefault(true),
	page: parseAsInteger.withDefault(0),
} as const;

export type ProductFiltersState = {
	category: string;
	brand: string;
	includeInactive: boolean;
	page: number;
};

export function useProductFilters() {
	return useQueryStates(productFiltersParsers, {
		history: "push",
		shallow: false,
	});
}

/** Parámetros base para la lista (slugs); la página resuelve slug → id para la API */
export function getProductListParamsFromFilters(filters: ProductFiltersState): {
	category: string;
	brand: string;
	includeInactive: boolean;
	limit: number;
	offset: number;
} {
	return {
		category: filters.category || "",
		brand: filters.brand || "",
		includeInactive: filters.includeInactive,
		limit: PAGE_SIZE,
		offset: filters.page * PAGE_SIZE,
	};
}

export { PAGE_SIZE };
