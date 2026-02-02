import { db } from "@renovabit/db";
import * as schema from "@renovabit/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI, username } from "better-auth/plugins";

export const auth = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL as string,
	basePath: "/api/v1/auth",
	secret: process.env.BETTER_AUTH_SECRET,
	trustedOrigins: [
		process.env.BETTER_AUTH_URL as string,
		process.env.ADMIN_URL as string,
		process.env.STORE_URL as string,
		"http://localhost:3000",
		"http://localhost:3002",
		"http://192.168.1.56:3000",
		"http://192.168.1.56:3002",
	],

	database: drizzleAdapter(db, {
		provider: "pg",
		usePlural: true,
		schema,
	}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		password: {
			hash: (pass) => Bun.password.hash(pass),
			verify: ({ password, hash }) => Bun.password.verify(password, hash),
		},
	},
	advanced: {
		database: {
			generateId: false,
		},
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7,
		cookieCache: {
			enabled: true,
			maxAge: 60 * 5,
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
	},
	plugins: [username(), openAPI()],
	telemetry: {
		enabled: false,
	},
});
