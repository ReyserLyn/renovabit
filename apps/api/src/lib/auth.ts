import { db } from "@renovabit/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";

export const auth = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3001",
	basePath: "/api/v1/auth",
	secret: process.env.BETTER_AUTH_SECRET,
	trustedOrigins: [
		process.env.BETTER_AUTH_URL ?? "http://localhost:3001",
		"http://localhost:3000",
		"http://localhost:3002",
		"http://192.s168.1.56:3000",
		"http://192.168.1.56:3002",
	],
	database: drizzleAdapter(db, {
		provider: "pg",
		usePlural: true,
	}),
	emailAndPassword: {
		enabled: true,
	},
	user: {
		additionalFields: {
			phone: {
				type: "string",
				required: false,
			},
			role: {
				type: "string",
				required: true,
				defaultValue: "customer",
			},
		},
	},
	plugins: [username()],
	telemetry: {
		enabled: false,
	},
});
