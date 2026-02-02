import { treaty } from "@elysiajs/eden";
import type { App, Session } from "@renovabit/api";

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

const API_BASE = getBaseURL();

export const api = treaty<App>(API_BASE, {
	fetch: {
		credentials: "include",
		mode: "cors",
	},
});

export type { Session };
