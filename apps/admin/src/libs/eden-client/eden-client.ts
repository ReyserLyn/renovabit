import { treaty } from "@elysiajs/eden";
import type { App, Session } from "@renovabit/api";

const getBaseURL = () => {
	if (typeof window !== "undefined") {
		return window.location.hostname === "localhost"
			? "http://localhost:3001"
			: "https://api.renovabit.com";
	}

	return process.env.VITE_API_URL || "http://localhost:3001";
};

const API_BASE = getBaseURL();

export const api = treaty<App>(API_BASE, {
	fetch: {
		credentials: "include",
		mode: "cors",
	},
});

export type { Session };
