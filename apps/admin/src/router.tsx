import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { DefaultCatchBoundary } from "@/components/layout/DefaultCatchBoundary";
import { NotFound } from "@/components/layout/NotFound";
import { getContext } from "./libs/tanstack-query/root-provider";
import type { MyRouterContext } from "./routes/__root";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const rqContext = getContext();

	const router = createRouter({
		routeTree,
		context: { ...rqContext, session: null } satisfies MyRouterContext,
		defaultPreload: "intent",
		// React Query maneja fetching y caché; loaders delegan en el cache
		defaultPreloadStaleTime: 0,
		defaultErrorComponent: DefaultCatchBoundary,
		defaultNotFoundComponent: NotFound,
		scrollRestoration: true,
		defaultStructuralSharing: true,
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient: rqContext.queryClient,
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
