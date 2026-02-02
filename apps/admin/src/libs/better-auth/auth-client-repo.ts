import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const baseURL =
	(typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
	(typeof process !== "undefined" && process.env?.VITE_API_URL) ||
	"http://localhost:3001";

const authClientRepo = createAuthClient({
	baseURL,
	basePath: "/api/v1/auth",
	plugins: [
		inferAdditionalFields({
			user: {
				username: { type: "string" },
				displayUsername: { type: "string" },
				phone: { type: "string" },
				role: { type: "string" },
			},
		}),
	],
});

export { authClientRepo };
