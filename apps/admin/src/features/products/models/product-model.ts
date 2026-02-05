import slugifyLib from "slugify";
import { z } from "zod";

export function slugify(name: string): string {
	return slugifyLib(name, {
		lower: true,
		strict: true,
		locale: "es",
	});
}

export const STATUS_LABELS: Record<
	"active" | "inactive" | "out_of_stock",
	string
> = {
	active: "Activo",
	inactive: "Inactivo",
	out_of_stock: "Agotado",
};

export const productFormSchema = z.object({
	name: z
		.string()
		.min(1, "El nombre es obligatorio.")
		.max(255, "El nombre no puede superar 255 caracteres."),
	slug: z
		.string()
		.min(1, "El slug es obligatorio.")
		.max(255, "El slug no puede superar 255 caracteres.")
		.regex(
			/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
			"El slug solo puede contener minúsculas, números y guiones.",
		),
	sku: z
		.string()
		.min(1, "El SKU es obligatorio.")
		.max(100, "El SKU no puede superar 100 caracteres."),
	description: z
		.string()
		.max(1000, "La descripción no puede superar 1000 caracteres.")
		.optional(),
	price: z
		.string()
		.regex(/^\d+(\.\d{1,2})?$/, "Formato inválido. Ejemplo: 99.99"),
	stock: z.number().int("El stock debe ser un número entero.").min(0),
	brandId: z.string().uuid("ID de marca no válido.").optional(),
	categoryId: z.string().uuid("ID de categoría no válido.").optional(),
	status: z.enum(["active", "inactive", "out_of_stock"]),
	isFeatured: z.boolean(),
	specEntries: z.array(
		z.object({
			id: z.string(),
			key: z.string().max(120, "Máx. 120 caracteres"),
			value: z.string().max(255, "Máx. 255 caracteres"),
		}),
	),
	images: z.array(
		z.object({
			id: z.string().optional(),
			url: z.union([z.url("URL inválida"), z.literal("")]),
			file: z.instanceof(File).optional(),
			alt: z.string().optional(),
			order: z.number().int().min(0),
		}),
	),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const defaultProductFormValues: ProductFormValues = {
	name: "",
	slug: "",
	sku: "",
	description: "",
	price: "0.00",
	stock: 0,
	brandId: undefined,
	categoryId: undefined,
	status: "active",
	isFeatured: false,
	specEntries: [],
	images: [],
};

/** Convierte record de especificaciones (API) a array para el formulario */
export function specRecordToEntries(
	record: Record<string, string>,
): Array<{ id: string; key: string; value: string }> {
	return Object.entries(record).map(([key, value], i) => ({
		id: `spec-${i}-${key}`,
		key,
		value,
	}));
}

/** Convierte array del formulario a record para la API (claves y valores trim, sin vacíos) */
export function specEntriesToRecord(
	entries: Array<{ id: string; key: string; value: string }>,
): Record<string, string> {
	const out: Record<string, string> = {};
	for (const { key, value } of entries) {
		const k = key.trim();
		if (k) out[k] = value.trim();
	}
	return out;
}
