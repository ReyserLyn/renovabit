import slugifyLib from "slugify";
import { z } from "zod";

export function slugify(name: string): string {
	return slugifyLib(name, {
		lower: true,
		strict: true,
		locale: "es",
	});
}

export const categoryFormSchema = z.object({
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
	description: z
		.string()
		.max(500, { error: "La descripción es demasiado larga." }),
	imageUrl: z.union([
		z.url({ error: "Introduce una URL válida." }),
		z.literal(""),
		z.instanceof(File),
	]),
	parentId: z.uuid({ error: "ID de padre no válido." }).nullable(),
	order: z.int().min(0, { error: "El orden no puede ser negativo." }),
	showInNavbar: z.boolean(),
	isActive: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const defaultCategoryFormValues: CategoryFormValues = {
	name: "",
	slug: "",
	description: "",
	imageUrl: "",
	parentId: null,
	order: 0,
	showInNavbar: true,
	isActive: true,
};
