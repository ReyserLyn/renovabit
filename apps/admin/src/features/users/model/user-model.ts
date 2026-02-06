import type { User } from "@renovabit/db/schema";
import { z } from "zod";

export type AdminUser = User;

export const userFormSchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(1, { error: "El nombre es requerido." })
			.max(255, { error: "El nombre no puede superar 255 caracteres." }),
		email: z
			.string()
			.trim()
			.email({ error: "El correo electrónico no es válido." })
			.max(255, { error: "El correo electrónico es demasiado largo." }),
		password: z
			.string()
			.min(8, { error: "La contraseña debe tener al menos 8 caracteres." })
			.max(255, { error: "La contraseña es demasiado larga." }),
		confirmPassword: z.string(),
		phone: z
			.string()
			.trim()
			.max(50, { error: "El teléfono es demasiado largo." })
			.optional()
			.or(z.literal("").transform(() => undefined)),
		username: z
			.string()
			.trim()
			.max(100, { error: "El nombre de usuario es demasiado largo." })
			.optional()
			.or(z.literal("").transform(() => undefined)),
		displayUsername: z
			.string()
			.trim()
			.max(100, { error: "El usuario es demasiado largo." })
			.regex(/^\S*$/, {
				message: "El usuario debe ser una sola palabra (sin espacios).",
			})
			.optional()
			.or(z.literal("").transform(() => undefined)),
		role: z.enum(["admin", "distributor", "customer"], {
			error: "El rol seleccionado no es válido.",
		}),
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.confirmPassword) {
			ctx.addIssue({
				code: "custom",
				message: "Las contraseñas no coinciden.",
				path: ["confirmPassword"],
			});
		}

		// Validar complejidad según el rol (solo para admin y distributor)
		if (data.role === "admin" || data.role === "distributor") {
			const hasUpperCase = /[A-Z]/.test(data.password);
			const hasLowerCase = /[a-z]/.test(data.password);
			const hasNumber = /[0-9]/.test(data.password);

			if (!hasUpperCase || !hasLowerCase || !hasNumber) {
				ctx.addIssue({
					code: "custom",
					message:
						"La contraseña debe contener al menos una mayúscula, una minúscula y un número.",
					path: ["password"],
				});
			}
		}
	});

export const userUpdateFormSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, { error: "El nombre es requerido." })
		.max(255, { error: "El nombre no puede superar 255 caracteres." })
		.optional(),
	email: z
		.string()
		.trim()
		.email({ error: "El correo electrónico no es válido." })
		.max(255, { error: "El correo electrónico es demasiado largo." })
		.optional(),
	phone: z
		.string()
		.trim()
		.max(50, { error: "El teléfono es demasiado largo." })
		.optional()
		.or(z.literal("").transform(() => undefined)),
	username: z
		.string()
		.trim()
		.max(100, { error: "El nombre de usuario es demasiado largo." })
		.optional()
		.or(z.literal("").transform(() => undefined)),
	displayUsername: z
		.string()
		.trim()
		.max(100, { error: "El usuario es demasiado largo." })
		.regex(/^\S*$/, {
			message: "El usuario debe ser una sola palabra (sin espacios).",
		})
		.optional()
		.or(z.literal("").transform(() => undefined)),
	role: z.enum(["admin", "distributor", "customer"], {
		error: "El rol seleccionado no es válido.",
	}),
});

export const userPasswordFormSchema = z
	.object({
		password: z
			.string()
			.min(8, { error: "La contraseña debe tener al menos 8 caracteres." })
			.max(255, { error: "La contraseña es demasiado larga." }),
		confirmPassword: z.string(),
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.confirmPassword) {
			ctx.addIssue({
				code: "custom",
				message: "Las contraseñas no coinciden.",
				path: ["confirmPassword"],
			});
		}
	});

export type UserFormValues = z.infer<typeof userFormSchema>;
export type UserUpdateFormValues = z.infer<typeof userUpdateFormSchema>;
export type UserPasswordFormValues = z.infer<typeof userPasswordFormSchema>;

export const defaultUserFormValues: UserFormValues = {
	name: "",
	email: "",
	password: "",
	confirmPassword: "",
	phone: undefined,
	username: undefined,
	displayUsername: undefined,
	role: "customer",
};

export const defaultUserUpdateFormValues: UserUpdateFormValues = {
	name: undefined,
	email: undefined,
	phone: undefined,
	username: undefined,
	displayUsername: undefined,
	role: "customer",
};

export const defaultUserPasswordFormValues: UserPasswordFormValues = {
	password: "",
	confirmPassword: "",
};

export function getUserDisplayName(user: AdminUser): string {
	if (user.displayUsername && user.displayUsername.trim().length > 0) {
		return user.displayUsername;
	}
	if (user.name && user.name.trim().length > 0) {
		return user.name;
	}
	if (user.username && user.username.trim().length > 0) {
		return user.username;
	}
	return user.email;
}

export function getRoleLabel(role: AdminUser["role"]): string {
	switch (role) {
		case "admin":
			return "Administrador";
		case "distributor":
			return "Distribuidor";
		case "customer":
		default:
			return "Cliente";
	}
}

export const roleWeight: Record<AdminUser["role"], number> = {
	admin: 3,
	distributor: 2,
	customer: 1,
} as const;

type UserRole = "admin" | "distributor" | "customer";

export function generateSecurePassword(role: UserRole = "customer"): string {
	const lowercase = "abcdefghijklmnopqrstuvwxyz";
	const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const numbers = "0123456789";
	const symbols = "!@#$%^&*";

	let charset = lowercase;
	let password = "";

	// Para admin y distributor, incluir mayúsculas, números y símbolos
	if (role === "admin" || role === "distributor") {
		charset = lowercase + uppercase + numbers + symbols;
		// Asegurar al menos una mayúscula, una minúscula y un número
		const upperIndex = Math.floor(Math.random() * uppercase.length);
		const lowerIndex = Math.floor(Math.random() * lowercase.length);
		const numberIndex = Math.floor(Math.random() * numbers.length);
		password +=
			uppercase.charAt(upperIndex) +
			lowercase.charAt(lowerIndex) +
			numbers.charAt(numberIndex);
		// Generar el resto de la contraseña (mínimo 8 caracteres, así que 5 más)
		const length = 8 + Math.floor(Math.random() * 9); // Entre 8 y 16 caracteres
		for (let i = password.length; i < length; i++) {
			password += charset[Math.floor(Math.random() * charset.length)];
		}
		// Mezclar los caracteres para que no siempre empiecen igual
		return password
			.split("")
			.sort(() => Math.random() - 0.5)
			.join("");
	}

	// Para customer, solo longitud mínima (8 caracteres)
	charset = lowercase + uppercase + numbers;
	const length = 8 + Math.floor(Math.random() * 9); // Entre 8 y 16 caracteres
	for (let i = 0; i < length; i++) {
		password += charset[Math.floor(Math.random() * charset.length)];
	}

	return password;
}
