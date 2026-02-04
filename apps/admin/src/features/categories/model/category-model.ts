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
	description: z.string().max(500, "La descripción es demasiado larga."),
	imageUrl: z.union([
		z.url("Introduce una URL válida."),
		z.string().length(0),
		z.instanceof(File),
	]),
	parentId: z.uuid("ID de padre no válido.").nullable(),
	order: z.number().int().min(0, "El orden no puede ser negativo."),
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
