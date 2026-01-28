import { Elysia } from "elysia";
import { auth } from "@/lib/auth";
import { authPlugin } from "@/lib/auth-plugin";

export const authRoutes = new Elysia({ prefix: "/auth" })
	.use(authPlugin)
	.mount("/", auth.handler)
	.get(
		"/me",
		({ user, session }) => {
			return { user, session };
		},
		{
			auth: true,
		},
	);
