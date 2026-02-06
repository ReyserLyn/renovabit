import { t } from "elysia";

export const ALLOWED_CONTENT_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
] as const;

// Unión explícita para que Eden/TypeScript infieran bien el body
const contentTypesUnion = t.Union([
	t.Literal("image/jpeg"),
	t.Literal("image/png"),
	t.Literal("image/webp"),
	t.Literal("image/gif"),
]);

export const uploadUrlBody = t.Object({
	filename: t.String(),
	contentType: contentTypesUnion,
	prefix: t.Optional(t.String()),
});

export const uploadUrlResponse = t.Object({
	key: t.String(),
	uploadUrl: t.String(),
	publicUrl: t.String(),
});

export const verifyUploadBody = t.Object({
	publicUrl: t.String({ format: "uri" }),
	declaredContentType: contentTypesUnion,
	key: t.Optional(t.String()),
});

export const verifyUploadSuccessResponse = t.Object({
	success: t.Literal(true),
});

export const verifyUploadErrorResponse = t.Object({
	success: t.Literal(false),
	message: t.String(),
});

export const deleteFileParams = t.Object({
	key: t.String(),
});

export const deleteFileResponse = t.Object({
	success: t.Boolean(),
});

export const messageResponse = t.Object({
	message: t.String(),
});
