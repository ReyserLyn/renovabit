import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { authClientRepo } from "./auth-client-repo.ts";

type Session = typeof authClientRepo.$Infer.Session;

const getSessionFn = createServerFn({
	method: "GET",
}).handler(async () => {
	const request = getRequest();
	if (!request) return null;

	const session = await authClientRepo.getSession({
		fetchOptions: {
			headers: request.headers,
		},
	});
	return session.data ?? null;
});

export { getSessionFn };
export type { Session };
