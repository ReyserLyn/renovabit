import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequest, setResponseHeader } from "@tanstack/react-start/server";
import { authClientRepo } from "./auth-client-repo.ts";

export type Session = typeof authClientRepo.$Infer.Session;

const AUTH_BASE_PATH = "/api/v1/auth";

function getAuthApiBaseUrl(): string {
	return process.env.VITE_API_URL ?? "http://localhost:3001";
}

export type GetSessionOptions = { signal?: AbortSignal };

export const getSessionFn = createServerFn({
	method: "GET",
}).handler(async (options?: GetSessionOptions) => {
	try {
		const request = getRequest();
		if (!request) return null;

		const url = `${getAuthApiBaseUrl()}${AUTH_BASE_PATH}/get-session`;
		const response = await fetch(url, {
			method: "GET",
			headers: request.headers,
			signal: options?.signal,
			credentials: "include",
		});

		const setCookieHeaders =
			typeof response.headers.getSetCookie === "function"
				? response.headers.getSetCookie()
				: [];
		const singleCookie = response.headers.get("Set-Cookie");
		if (setCookieHeaders.length > 0) {
			for (const cookie of setCookieHeaders) {
				setResponseHeader("Set-Cookie", cookie);
			}
		} else if (singleCookie) {
			setResponseHeader("Set-Cookie", singleCookie);
		}

		if (!response.ok) return null;

		const body = (await response.json()) as Session | null;
		return body ?? null;
	} catch (error) {
		if (process.env.NODE_ENV !== "production") {
			console.error("Error al obtener sesión:", error);
		}
		return null;
	}
});

export const authQueryOptions = () =>
	queryOptions({
		queryKey: ["session"],
		queryFn: ({ signal }) => getSessionFn({ signal }),
		staleTime: 1000 * 60 * 5,
	});
