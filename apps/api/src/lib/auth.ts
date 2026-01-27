import { db } from "@renovabit/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";

export const auth = betterAuth({
	basePath: "/api/v1/auth",
	secret: process.env.BETTER_AUTH_SECRET,
	trustedOrigins: [
		process.env.BETTER_AUTH_URL ?? "",
		"localhost",
		"192.168.1.56",
	],
	database: drizzleAdapter(db, {
		provider: "pg",
		usePlural: true,
	}),
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
