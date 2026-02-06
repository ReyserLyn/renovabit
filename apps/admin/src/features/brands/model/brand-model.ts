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
		.min(1, { error: "El nombre es obligatorio." })
		.max(100, { error: "El nombre no puede superar 100 caracteres." }),
	slug: z
		.string()
		.min(1, { error: "El slug es obligatorio." })
		.max(100, { error: "El slug no puede superar 100 caracteres." })
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
			error: "El slug solo puede contener minúsculas, números y guiones.",
		}),
	logo: z
		.union([
			z.url({ error: "Introduce una URL válida." }),
			z.literal(""),
			z.instanceof(File),
		])
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
