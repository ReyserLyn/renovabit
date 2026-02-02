import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const getBaseURL = () => {
	if (typeof window !== "undefined") {
		const host = window.location.hostname;
		if (host !== "localhost" && host.endsWith("renovabit.com")) {
			return "https://api.renovabit.com";
		}
	}
	return (
		(typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
		(typeof process !== "undefined" && process.env?.VITE_API_URL) ||
		"http://localhost:3001"
	);
};

const baseURL = getBaseURL();

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
