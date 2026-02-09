import { db } from "@renovabit/db";
import * as schema from "@renovabit/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, openAPI, username } from "better-auth/plugins";

export const auth = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL as string,
	basePath: "/api/v1/auth",
	secret: process.env.BETTER_AUTH_SECRET,
	trustedOrigins: [
		process.env.BETTER_AUTH_URL as string,
		process.env.ADMIN_URL as string,
		process.env.STORE_URL as string,
		"http://localhost:*/**",
		"http://192.168.*.*:*/**",
		"https://*.renovabit.com",
	],
	database: drizzleAdapter(db, {
		provider: "pg",
		usePlural: true,
		schema,
		camelCase: false,
	}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		password: {
			hash: (pass) => Bun.password.hash(pass),
			verify: ({ password, hash }) => Bun.password.verify(password, hash),
		},
	},
	session: {
		expiresIn: 60 * 60 * 24,
		cookieCache: {
			enabled: true,
			maxAge: 60 * 5,
		},
	},
	advanced: {
		database: {
			generateId: false,
		},
		crossSubDomainCookies: {
			enabled: true,
			domain:
				process.env.NODE_ENV === "production" ? "renovabit.com" : "localhost",
		},
	},
	user: {
		additionalFields: {
			username: {
				type: "string",
				required: false,
				input: true,
			},
			displayUsername: {
				type: "string",
				required: false,
				input: true,
			},
			phone: {
				type: "string",
				required: false,
				input: true,
			},
			role: {
				type: ["admin", "customer", "distributor"],
				required: true,
				index: true,
				defaultValue: "customer",
				input: true,
			},
		},
		deleteUser: {
			enabled: true,
			beforeDelete: async (user) => {
				const fullUser = await db.query.users.findFirst({
					where: (table, { eq }) => eq(table.id, user.id),
				});

				if (fullUser?.role === "admin") {
					const adminCount = await db.query.users.findMany({
						where: (table, { eq }) => eq(table.role, "admin"),
					});

					if (adminCount.length <= 1) {
						const { APIError } = await import("better-auth/api");
						throw new APIError("BAD_REQUEST", {
							message:
								"No se puede eliminar el último administrador. Debe haber al menos un administrador en el sistema.",
						});
					}
				}
			},
		},
	},
	plugins: [
		username({
			usernameNormalization: (u) => u.trim().toLowerCase(),
		}),
		admin({
			defaultRole: "customer",
			adminRoles: ["admin"],
			bannedUserMessage:
				"Has sido baneado de esta aplicación. Por favor contacta al soporte si crees que esto es un error.",
			impersonationSessionDuration: 60 * 60,
			defaultBanReason: "Sin razón especificada",
			allowImpersonatingAdmins: false,
		}),
		openAPI(),
	],
});
