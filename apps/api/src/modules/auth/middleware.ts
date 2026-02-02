/** biome-ignore-all lint/suspicious/noExplicitAny: Documentation Elysia */
import { Elysia } from "elysia";
import { auth } from "@/modules/auth/auth";

export const authMacro = new Elysia({ name: "auth-macro", prefix: "/auth" })
	.mount(auth.handler)
	.macro({
		isAuth: {
			async resolve({ status, request: { headers } }) {
				const session = await auth.api.getSession({ headers });
				if (!session) return status(401, { message: "Unauthorized!" });

				return {
					user: session.user,
					session: session.session,
				};
			},
		},
		isAdmin: {
			async resolve({ status, request: { headers } }) {
				const session = await auth.api.getSession({ headers });
				if (!session) return status(401, { message: "Unauthorized!" });
				if (session.user.role !== "admin")
					return status(403, { message: "Forbidden: Admin only" });

				return {
					user: session.user,
					session: session.session,
				};
			},
		},
		isOwnerOrAdmin: {
			async resolve({ params, status, request: { headers } }) {
				const session = await auth.api.getSession({ headers });
				if (!session) return status(401, { message: "Unauthorized!" });

				const user = session.user;
				const targetId = (params as any).id;

				// Check if user is admin OR if the target ID is the user's own ID
				if (user.role !== "admin" && user.id !== targetId) {
					return status(403, { message: "Forbidden: Not owner and not admin" });
				}

				return {
					user: session.user,
					session: session.session,
				};
			},
		},
	});

export const authRoutes = authMacro;

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema());

export const OpenAPI = {
	getPaths: (prefix = "/api/v1/auth") =>
		getSchema().then(({ paths }) => {
			const reference: typeof paths = Object.create(null);

			for (const path of Object.keys(paths)) {
				const key = prefix + path;
				reference[key] = paths[path];

				for (const method of Object.keys(paths[path])) {
					const operation = (reference[key] as any)[method];

					operation.tags = ["Better Auth"];
				}
			}

			return reference;
		}) as Promise<any>,
	components: getSchema().then(({ components }) => components) as Promise<any>,
} as const;
