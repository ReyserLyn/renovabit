import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-zod";
import z from "zod";
import { sessions, users } from "./auth";

export function deriveUsername(
	displayUsername: string | undefined,
): string | undefined {
	if (!displayUsername?.trim()) return undefined;
	const first = displayUsername.trim().split(/\s+/)[0];
	return first ? first.toLowerCase() : undefined;
}

import { brands } from "./brands";
import { categories } from "./categories";
import { productImages, products } from "./products";

export const productSpecificationSchema = z.object({
	id: z.string(),
	key: z.string().trim().max(120, { error: "Máx. 120 caracteres" }),
	value: z.string().trim().max(255, { error: "Máx. 255 caracteres" }),
});

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
		specifications: z.array(productSpecificationSchema).default([]),
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
		/** Nombre de usuario para mostrar. username se deriva de aquí. */
		displayUsername: z
			.string()
			.min(1, { error: "El nombre de usuario es requerido" })
			.max(255, {
				error: "El nombre de usuario no puede superar 255 caracteres",
			})
			.regex(/^\S*$/, {
				error: "El nombre de usuario no puede contener espacios",
			}),
		role: z.enum(["admin", "customer", "distributor"], {
			error: "El rol seleccionado no es válido",
		}),
	},
};

const passwordSchema = z
	.string()
	.min(8, { error: "La contraseña debe tener al menos 8 caracteres" })
	.max(255, { error: "La contraseña no puede superar 255 caracteres" });

const PASSWORD_STRENGTH_ERROR_CUSTOMER =
	"La contraseña debe tener al menos 8 caracteres y un número.";

const PASSWORD_STRENGTH_ERROR_ADMIN =
	"La contraseña debe contener al menos una mayúscula, una minúscula, un número y un símbolo (!@#$%^&*).";

const PASSWORD_CHARS = {
	lower: "abcdefghijklmnopqrstuvwxyz",
	upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	digit: "0123456789",
	symbol: "!@#$%^&*",
} as const;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 16;

function secureRandomInt(max: number): number {
	const value = crypto.getRandomValues(new Uint32Array(1))[0];
	return (value ?? 0) % max;
}

function shuffleArray<T>(arr: T[]): T[] {
	const out = [...arr];
	for (let i = out.length - 1; i > 0; i--) {
		const j = secureRandomInt(i + 1);
		const tmp = out[i];
		out[i] = out[j]!;
		out[j] = tmp!;
	}
	return out;
}

/** Genera una contraseña que cumple los requisitos mínimos del rol (puede ser más fuerte) */
export function generateSecurePassword(
	role: "admin" | "customer" | "distributor",
): string {
	const length =
		PASSWORD_MIN_LENGTH +
		secureRandomInt(PASSWORD_MAX_LENGTH - PASSWORD_MIN_LENGTH + 1);
	const chars: string[] = [];

	if (role === "customer") {
		// Cliente: mínimo 8 chars + 1 número
		chars.push(
			PASSWORD_CHARS.digit.charAt(secureRandomInt(PASSWORD_CHARS.digit.length)),
		);
		const charset =
			PASSWORD_CHARS.lower + PASSWORD_CHARS.upper + PASSWORD_CHARS.digit;
		while (chars.length < length) {
			chars.push(charset.charAt(secureRandomInt(charset.length)));
		}
	} else {
		// Admin y distributor: mínimo 1 de cada tipo
		chars.push(
			PASSWORD_CHARS.upper.charAt(secureRandomInt(PASSWORD_CHARS.upper.length)),
			PASSWORD_CHARS.lower.charAt(secureRandomInt(PASSWORD_CHARS.lower.length)),
			PASSWORD_CHARS.digit.charAt(secureRandomInt(PASSWORD_CHARS.digit.length)),
			PASSWORD_CHARS.symbol.charAt(
				secureRandomInt(PASSWORD_CHARS.symbol.length),
			),
		);
		const charset =
			PASSWORD_CHARS.lower +
			PASSWORD_CHARS.upper +
			PASSWORD_CHARS.digit +
			PASSWORD_CHARS.symbol;
		while (chars.length < length) {
			chars.push(charset.charAt(secureRandomInt(charset.length)));
		}
	}

	return shuffleArray(chars).join("");
}

/** Valida que la contraseña cumpla requisitos por rol */
export function validatePasswordForRole(
	password: string,
	role: "admin" | "customer" | "distributor",
): { valid: true } | { valid: false; message: string } {
	if (role === "customer") {
		if (!/[0-9]/.test(password)) {
			return { valid: false, message: PASSWORD_STRENGTH_ERROR_CUSTOMER };
		}
		return { valid: true };
	}
	// admin y distributor: mínimo 1 de cada tipo (mayúscula, minúscula, número, símbolo)
	const hasUpperCase = /[A-Z]/.test(password);
	const hasLowerCase = /[a-z]/.test(password);
	const hasNumber = /[0-9]/.test(password);
	const hasSymbol = /[!@#$%^&*]/.test(password);
	if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSymbol) {
		return { valid: false, message: PASSWORD_STRENGTH_ERROR_ADMIN };
	}
	return { valid: true };
}

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

export const productImageForProductSchema = rawInsert.productImage.omit({
	...omitLifecycleDates,
	productId: true,
});

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
		update: rawUpdate.category.omit(omitLifecycleDates).partial(),
	},
	product: {
		select: rawSelect.product,
		insert: rawInsert.product.omit(omitLifecycleDates).extend({
			images: z.array(productImageForProductSchema).optional().default([]),
		}),
		update: rawUpdate.product
			.omit(omitLifecycleDates)
			.partial()
			.extend({
				images: z
					.array(rawUpdate.productImage.omit({ productId: true }).partial())
					.optional(),
			}),
	},
	productImage: {
		select: rawSelect.productImage,
		insert: rawInsert.productImage.omit(omitLifecycleDates),
		update: rawUpdate.productImage.omit(omitLifecycleDates).partial(),
	},
	user: {
		select: rawSelect.user,
		insert: rawInsert.user.omit(omitLifecycleDates),
		update: rawUpdate.user
			.omit(omitLifecycleDates)
			.partial()
			.transform((data) => {
				if (data.displayUsername !== undefined)
					return { ...data, username: deriveUsername(data.displayUsername) };
				return data;
			}),

		session: rawSelect.session,

		adminCreate: rawInsert.user
			.omit({ ...omitLifecycleDates, username: true })
			.extend({
				password: passwordSchema,
				confirmPassword: z.string(),
			})
			.transform((data) => ({
				...data,
				username: deriveUsername(data.displayUsername),
			}))
			.superRefine((data, ctx) => {
				if (data.password !== data.confirmPassword) {
					ctx.addIssue({
						code: "custom",
						message: "Las contraseñas no coinciden",
						path: ["confirmPassword"],
					});
				}
				const result = validatePasswordForRole(data.password, data.role);
				if (!result.valid) {
					ctx.addIssue({
						code: "custom",
						message: result.message,
						path: ["password"],
					});
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

		ban: z.object({
			banReason: z
				.string()
				.max(500, { error: "La razón del baneo es demasiado larga." }),
			banExpiresIn: z.number().int().min(0, {
				error: "Use 0 para baneo permanente o un número positivo (segundos).",
			}),
		}),
	},
} as const;
