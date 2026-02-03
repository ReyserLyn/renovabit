import { createMiddleware } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { getSessionFn } from "../better-auth/auth-session";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
	const session = await getSessionFn();

	if (!session) {
		setResponseStatus(401);
		throw new Error("Unauthorized");
	}

	return next({ context: { session } });
});
