import { Elysia } from "elysia";
import { auth } from "./auth";

export const authPlugin = new Elysia({ name: "auth-plugin" }).macro({
	auth: (enabled: boolean) => ({
		async resolve({ status, request: { headers } }) {
			if (!enabled) return;

			const session = await auth.api.getSession({ headers });

			if (!session) {
				return status(401, {
					message: "Unauthorized",
				});
			}

			return {
				user: session.user,
				session: session.session,
			};
		},
	}),
});
