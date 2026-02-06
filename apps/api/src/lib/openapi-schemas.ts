export const openapiErrorResponseSchema = {
	type: "object",
	required: ["message"],
	properties: {
		code: { type: "string" },
		message: { type: "string" },
		details: { type: "object" },
	},
} as const;
