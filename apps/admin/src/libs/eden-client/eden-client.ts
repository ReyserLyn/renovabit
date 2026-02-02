import { treaty } from "@elysiajs/eden";
import type { App, Session } from "@renovabit/api";

const API_BASE =
	(typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
	(typeof process !== "undefined" && process.env?.VITE_API_URL) ||
	"http://localhost:3001";

export const api = treaty<App>(API_BASE, {
	fetch: {
		credentials: "include",
		mode: "cors",
	},
});

export type { Session };
