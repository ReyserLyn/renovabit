import slugifyLib from "slugify";
import { z } from "zod";

export function slugify(name: string): string {
	return slugifyLib(name, {
		lower: true,
		strict: true,
		locale: "es",
	});
}

export const brandFormSchema = z.object({
	name: z
		.string()
		.min(1, "El nombre es obligatorio.")
		.max(100, "El nombre no puede superar 100 caracteres."),
	slug: z
		.string()
		.min(1, "El slug es obligatorio.")
		.max(100, "El slug no puede superar 100 caracteres.")
		.regex(
			/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
			"El slug solo puede contener minúsculas, números y guiones.",
		),
	logo: z
		.url({ error: "Introduce una URL válida." })
		.or(z.literal(""))
		.optional(),
	isActive: z.boolean(),
});

export type BrandFormValues = z.infer<typeof brandFormSchema>;

export const defaultBrandFormValues: BrandFormValues = {
	name: "",
	slug: "",
	logo: "",
	isActive: true,
};
