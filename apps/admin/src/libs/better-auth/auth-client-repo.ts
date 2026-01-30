import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const authClientRepo = createAuthClient({
	baseURL: "http://localhost:3001",
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
