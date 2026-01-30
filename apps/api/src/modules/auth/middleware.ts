/** biome-ignore-all lint/suspicious/noExplicitAny: Documentation Elysia */
import { Elysia } from "elysia";
import { auth } from "@/modules/auth/auth";

const authApp = new Elysia({ name: "auth-macro", prefix: "/auth" })
	.mount(auth.handler)
	.macro({
		isAuth: {
			async resolve({ status, request: { headers } }) {
				const session = await auth.api.getSession({
					headers,
				});

				if (!session) return status(401, { error: "Unauthorized!" });

				return {
					user: session.user,
					session: session.session,
				};
			},
		},
	});

export const authRoutes = authApp;
export const authMacro = authApp;

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
