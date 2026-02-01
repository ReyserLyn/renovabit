import { treaty } from "@elysiajs/eden";
import type { App, Session } from "@renovabit/api";

const API_BASE = "http://localhost:3001";

export const api = treaty<App>(API_BASE, {
	fetch: {
		credentials: "include",
		mode: "cors",
	},
});

export type { Session };
