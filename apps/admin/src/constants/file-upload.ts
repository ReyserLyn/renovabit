import z from "zod";

export const ACCEPTED_IMAGE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
] as const;

export const ACCEPT_IMAGE_STRING = ACCEPTED_IMAGE_TYPES.join(",");

const MAX_FILE_SIZE = 5_000_000; // 5 MB

export const logoFormField = z
	.union([
		z.url({ error: "Introduce una URL válida" }),
		z.literal(""),
		z
			.instanceof(File, { error: "Introduce una imagen válida" })
			.refine((file) => file.size <= MAX_FILE_SIZE, {
				error: "La imagen debe pesar menos de 5 MB",
			})
			.refine(
				(file) =>
					(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type),
				{
					error: "Formato no válido. Usa JPEG, PNG o WebP",
				},
			),
		z.null(),
	])
	.optional();
