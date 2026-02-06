import { t } from "elysia";

export const idParam = t.Object({
	id: t.String({
		pattern:
			"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-7[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$",
		minLength: 36,
		maxLength: 36,
	}),
});

export const slugOrIdParam = t.Object({
	id: t.String({
		pattern: "^[a-zA-Z0-9-]+$",
		minLength: 1,
		maxLength: 255,
	}),
});
