import { useRouterState } from "@tanstack/react-router";
import type { BreadcrumbItemConfig } from "@/components/layout/authenticated-header";

const ROOT: BreadcrumbItemConfig = {
	label: "Panel de Administración",
	to: "/",
};

/** Ruta → breadcrumbs. Al añadir una ruta nueva en _authenticated, registrar aquí para que el header la muestre. */
const ROUTE_BREADCRUMBS: Record<string, BreadcrumbItemConfig[]> = {
	"/": [ROOT, { label: "Dashboard" }],
	"/productos": [ROOT, { label: "Productos" }],
	"/categorias": [ROOT, { label: "Categorías" }],
	"/marcas": [ROOT, { label: "Marcas" }],
	"/clientes": [ROOT, { label: "Clientes" }],
};

/**
 * Devuelve los breadcrumbs para la ruta dada.
 */
export function getBreadcrumbsForPath(
	pathname: string,
): BreadcrumbItemConfig[] {
	const normalized = pathname.replace(/\/$/, "") || "/";
	return ROUTE_BREADCRUMBS[normalized] ?? [ROOT];
}

/**
 * Hook que devuelve los breadcrumbs según la ruta actual.
 */
export function useBreadcrumbs(): BreadcrumbItemConfig[] {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return getBreadcrumbsForPath(pathname);
}
