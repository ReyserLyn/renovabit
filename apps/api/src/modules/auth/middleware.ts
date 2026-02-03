/** biome-ignore-all lint/suspicious/noExplicitAny: Documentation Elysia */
import { Elysia } from "elysia";
import { auth } from "@/modules/auth/auth";

type AuthSession = typeof auth.$Infer.Session;
export type AuthUser = AuthSession["user"];

export const isAdminUser = (user: AuthUser | null): boolean => {
	return user?.role === "admin";
};

const getSessionFromHeaders = async (
	headers: Headers | Record<string, string>,
) => {
	const headersObj =
		headers instanceof Headers
			? headers
			: new Headers(headers as Record<string, string>);

	try {
		return await auth.api.getSession({
			headers: headersObj,
		});
	} catch (e) {
		console.error("Auth error:", e);
		return null;
	}
};

export const authMacro = new Elysia({ name: "auth-macro" })
	.mount("/", auth.handler)
	.derive({ as: "scoped" }, async ({ request: { headers } }) => {
		const session = await getSessionFromHeaders(headers);
		return {
			user: (session?.user ?? null) as AuthUser | null,
			session: session?.session ?? null,
		};
	})
	.macro({
		isAuth: {
			resolve({ user, status }) {
				if (!user) return status(401, { message: "Unauthorized!" });

				return {
					user,
				};
			},
		},
		isAdmin: {
			resolve({ user, status }) {
				if (!user) return status(401, { message: "Unauthorized!" });

				if (user.role !== "admin")
					return status(403, { message: "Forbidden!" });

				return {
					user,
				};
			},
		},
		isOwnerOrAdmin: {
			resolve({ params, user, status }) {
				if (!user) return status(401, { message: "Unauthorized!" });

				const targetId = (params as { id?: string }).id;

				if (user.role !== "admin" && user.id !== targetId) {
					return status(403, { message: "Forbidden!" });
				}

				return {
					user,
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
			const reference: any = Object.create(null);

			for (const [path, pathData] of Object.entries(paths)) {
				const key = prefix + path;
				if (!pathData) continue;
				reference[key] = pathData;

				for (const method of Object.keys(pathData)) {
					const operation = (reference[key] as any)[method];

					operation.tags = ["Better Auth"];
				}
			}

			return reference;
		}) as Promise<any>,
	components: getSchema().then(({ components }) => components) as Promise<any>,
} as const;
