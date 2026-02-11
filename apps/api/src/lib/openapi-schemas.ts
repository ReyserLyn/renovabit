import z from "zod";

export const openapiErrorResponseSchema = {
	type: "object",
	required: ["message"],
	properties: {
		code: { type: "string" },
		message: { type: "string" },
		details: { type: "object" },
	},
} as const;

export function mergeOpenApiComponents(
	authComponents: Record<string, unknown>,
): Record<string, unknown> {
	const existing =
		authComponents?.schemas && typeof authComponents.schemas === "object"
			? (authComponents.schemas as Record<string, unknown>)
			: {};
	return {
		...authComponents,
		schemas: { ...existing, ErrorResponse: openapiErrorResponseSchema },
	};
}

/*
 * Transforma schemas Zod antes de generar JSON Schema: reemplaza z.date() por
 * z.iso.datetime()
 */
export const openApiZodMapJsonSchema = {
	zod: (schema: z.ZodTypeAny) => {
		type WrappableSchema = Parameters<typeof z.optional>[0];

		const fix = (s: z.ZodTypeAny): z.ZodTypeAny => {
			if (s instanceof z.ZodDate) return z.iso.datetime();
			if (s instanceof z.ZodOptional)
				return z.optional(fix(s.unwrap() as z.ZodTypeAny) as WrappableSchema);
			if (s instanceof z.ZodNullable)
				return z.nullable(fix(s.unwrap() as z.ZodTypeAny) as WrappableSchema);
			if (s instanceof z.ZodObject)
				return z.object(
					Object.fromEntries(
						Object.entries(s.shape).map(([k, v]) => [
							k,
							fix(v as z.ZodTypeAny),
						]),
					),
				);
			if (s instanceof z.ZodArray) {
				const elementSchema = fix(s.element as z.ZodTypeAny);
				return z.array(elementSchema as Parameters<typeof z.array>[0]);
			}
			return s;
		};

		return z.toJSONSchema(fix(schema));
	},
};
