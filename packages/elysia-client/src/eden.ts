import { edenTreaty } from "@elysiajs/eden";
import type { App as ElysiaApp } from "@renovabit/api";

export const api = edenTreaty<ElysiaApp>("http://localhost:3001", {
	$fetch: {
		credentials: "include",
		mode: "cors",
	},
}) as ReturnType<typeof edenTreaty<ElysiaApp>>;

export type { App as ElysiaApp, Session } from "@renovabit/api";
