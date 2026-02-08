import { treaty } from "@elysiajs/eden";
import type { App } from "@renovabit/api";

export interface CreateApiClientOptions {
	credentials?: RequestCredentials;
}

/**
 * Crea el cliente Eden Treaty tipado con la API.
 */
export function createApiClient(
	baseUrl: string,
	options: CreateApiClientOptions = {},
): ReturnType<typeof treaty<App>> {
	const { credentials = "include" } = options;
	return treaty<App>(baseUrl, {
		fetch: { credentials },
	});
}
