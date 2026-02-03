import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { authClientRepo } from "./auth-client-repo.ts";

export type Session = typeof authClientRepo.$Infer.Session;

export const getSessionFn = createServerFn({
	method: "GET",
}).handler(async () => {
	const request = getRequest();
	if (!request) return null;

	const { data } = await authClientRepo.getSession({
		fetchOptions: {
			headers: request.headers,
		},
	});

	return data ?? null;
});

export const authQueryOptions = () =>
	queryOptions({
		queryKey: ["session"],
		queryFn: () => getSessionFn(),
		staleTime: 1000 * 60 * 5,
	});
