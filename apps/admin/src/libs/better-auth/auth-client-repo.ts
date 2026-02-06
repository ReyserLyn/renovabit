import {
	inferAdditionalFields,
	usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const getBaseURL = () => {
	if (typeof window !== "undefined") {
		return window.location.hostname === "localhost"
			? "http://localhost:3001"
			: "https://api.renovabit.com";
	}
	return process.env.VITE_API_URL || "http://localhost:3001";
};

const baseURL = getBaseURL();

const authClientRepo = createAuthClient({
	baseURL,
	basePath: "/api/v1/auth",
	plugins: [
		usernameClient(),
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
