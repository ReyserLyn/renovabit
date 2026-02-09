import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-zod";
import z from "zod";
import { sessions, users } from "./auth";
import { brands } from "./brands";
import { categories } from "./categories";
import { productImages, products } from "./products";

const validations = {
	brand: {
		name: z
			.string()
			.min(1, { error: "El nombre es requerido" })
			.max(100, { error: "El nombre no puede superar 100 caracteres" }),
		slug: z
			.string()
			.min(1, { error: "El slug es requerido" })
			.max(100, { error: "El slug no puede superar 100 caracteres" })
			.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
				error:
					"El slug no es válido, debe contener solo letras minúsculas y números",
			}),
		logo: z
			.union([z.url({ error: "Introduce una URL válida" }), z.literal("")])
			.optional()
			.nullable(),
		isActive: z.boolean({ error: "El estado de activación es requerido" }),
	},
	category: {
		name: z
			.string()
			.min(1, { error: "El nombre es requerido." })
			.max(100, { error: "El nombre no puede superar los 100 caracteres." }),
		slug: z
			.string()
			.min(1, { error: "El slug es requerido." })
			.max(100, { error: "El slug no puede superar los 100 caracteres." })
			.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
				error:
					"El slug no es válido, debe contener solo letras minúsculas y números",
			}),
		description: z.string().max(500, {
			error: "La descripción no puede superar los 500 caracteres",
		}),
		imageUrl: z
			.union([z.url({ error: "Introduce una URL válida" }), z.literal("")])
			.optional()
			.nullable(),
		parentId: z.uuidv7({ error: "ID de padre no válido." }).nullable(),
		order: z.int().min(0, { error: "El orden debe ser un número positivo." }),
		showInNavbar: z.boolean({
			error: "El estado de visualización en navbar es requerido",
		}),
		isActive: z.boolean({ error: "El estado de activación es requerido" }),
	},
	product: {
		name: z
			.string()
			.min(1, { error: "El nombre es obligatorio." })
			.max(255, { error: "El nombre no puede superar 255 caracteres." }),
		slug: z
			.string()
			.min(1, { error: "El slug es obligatorio." })
			.max(255, { error: "El slug no puede superar 255 caracteres." })
			.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
				error: "El slug solo puede contener minúsculas, números y guiones.",
			}),
		sku: z
			.string()
			.min(1, { error: "El SKU es obligatorio." })
			.max(100, { error: "El SKU no puede superar 100 caracteres." }),
		description: z
			.string()
			.max(1000, { error: "La descripción no puede superar 1000 caracteres." })
			.optional(),
		price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
			error: "Formato inválido. Ejemplo: 99.99",
		}),
		stock: z
			.int()
			.min(0, { error: "El stock debe ser un número entero >= 0." }),
		brandId: z.uuid({ error: "ID de marca no válido." }).optional(),
		categoryId: z.uuid({ error: "ID de categoría no válido." }).optional(),
		status: z.enum(["active", "inactive", "out_of_stock"]),
		isFeatured: z.boolean(),
		specifications: z.array(
			z.object({
				id: z.string(),
				key: z.string().max(120, { error: "Máx. 120 caracteres" }),
				value: z.string().max(255, { error: "Máx. 255 caracteres" }),
			}),
		),
	},
	productImage: {
		url: z.url({ error: "Introduce una URL válida" }),
		alt: z
			.string()
			.max(255, {
				error: "El texto alternativo no puede superar 255 caracteres",
			})
			.optional(),
		order: z.int().min(0, { error: "El orden debe ser un número positivo." }),
	},
	user: {
		name: z
			.string()
			.min(1, { error: "El nombre es requerido" })
			.max(255, { error: "El nombre no puede superar 255 caracteres" }),
		email: z.email({ error: "El correo electrónico no es válido" }).max(255, {
			error: "El correo electrónico no puede superar 255 caracteres",
		}),
		phone: z
			.string()
			.max(50, { error: "El teléfono no puede superar 50 caracteres" })
			.optional(),
		username: z
			.string()
			.min(1, { error: "El nombre de usuario es requerido" })
			.max(100, {
				error: "El nombre de usuario no puede superar 100 caracteres",
			})
			.regex(/^\S*$/, {
				error: "El nombre de usuario no puede contener espacios",
			})
			.optional(),
		displayUsername: z
			.string()
			.min(1, { error: "El nombre de usuario es requerido" })
			.max(255, {
				error: "El nombre de usuario no puede superar 255 caracteres",
			})
			.regex(/^\S*$/, {
				error: "El nombre de usuario no puede contener espacios",
			})
			.optional(),
		role: z.enum(["admin", "distributor", "customer"], {
			error: "El rol seleccionado no es válido",
		}),
	},
};

const passwordSchema = z
	.string()
	.min(8, { error: "La contraseña debe tener al menos 8 caracteres" })
	.max(255, { error: "La contraseña no puede superar 255 caracteres" });

const rawSelect = {
	brand: createSelectSchema(brands),
	category: createSelectSchema(categories),
	product: createSelectSchema(products),
	productImage: createSelectSchema(productImages),
	user: createSelectSchema(users),
	session: createSelectSchema(sessions),
};

const rawInsert = {
	brand: createInsertSchema(brands, validations.brand),
	category: createInsertSchema(categories, validations.category),
	product: createInsertSchema(products, validations.product),
	productImage: createInsertSchema(productImages, validations.productImage),
	user: createInsertSchema(users, validations.user),
};

const rawUpdate = {
	brand: createUpdateSchema(brands, validations.brand),
	category: createUpdateSchema(categories, validations.category),
	product: createUpdateSchema(products, validations.product),
	productImage: createUpdateSchema(productImages, validations.productImage),
	user: createUpdateSchema(users, validations.user),
};

const omitLifecycleDates = {
	id: true,
	createdAt: true,
	updatedAt: true,
} as const;

// schemas de las tabla
export const schemas = {
	brand: {
		select: rawSelect.brand,
		insert: rawInsert.brand.omit(omitLifecycleDates),
		update: rawUpdate.brand.omit(omitLifecycleDates).partial(),
	},
	category: {
		select: rawSelect.category,
		insert: rawInsert.category.omit(omitLifecycleDates),
		update: rawUpdate.category.omit(omitLifecycleDates),
	},
	product: {
		insert: rawInsert.product.omit(omitLifecycleDates).and(
			z.object({
				images: z
					.array(rawInsert.productImage.omit(omitLifecycleDates).partial())
					.optional(),
			}),
		),
		update: rawUpdate.product.omit(omitLifecycleDates).partial(),
		select: rawSelect.product,
	},
	productImage: {
		insert: rawInsert.productImage.omit(omitLifecycleDates),
		update: rawUpdate.productImage.omit(omitLifecycleDates).partial(),
		select: rawSelect.productImage,
	},
	user: {
		select: rawSelect.user,
		insert: rawInsert.user.omit(omitLifecycleDates),
		update: rawUpdate.user.omit(omitLifecycleDates),

		session: rawSelect.session,

		adminCreate: rawInsert.user
			.omit(omitLifecycleDates)
			.extend({
				password: passwordSchema,
				confirmPassword: z.string(),
			})
			.superRefine((data, ctx) => {
				if (data.password !== data.confirmPassword) {
					ctx.addIssue({
						code: "custom",
						message: "Las contraseñas no coinciden",
						path: ["confirmPassword"],
					});
				}
				if (data.role === "admin" || data.role === "distributor") {
					const hasUpperCase = /[A-Z]/.test(data.password);
					const hasLowerCase = /[a-z]/.test(data.password);
					const hasNumber = /[0-9]/.test(data.password);
					if (!hasUpperCase || !hasLowerCase || !hasNumber) {
						ctx.addIssue({
							code: "custom",
							message:
								"La contraseña debe contener al menos una mayúscula, una minúscula y un número",
							path: ["password"],
						});
					}
				}
			}),

		adminChangePassword: z
			.object({
				password: passwordSchema,
				confirmPassword: z.string(),
			})
			.superRefine((data, ctx) => {
				if (data.password !== data.confirmPassword) {
					ctx.addIssue({
						code: "custom",
						message: "Las contraseñas no coinciden",
						path: ["confirmPassword"],
					});
				}
			}),
	},
} as const;
