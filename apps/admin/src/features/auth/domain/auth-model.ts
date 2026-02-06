import { z } from "zod";

export const loginSchema = z.object({
	emailOrUsername: z
		.string()
		.min(1, { error: "El correo o usuario es obligatorio." })
		.max(255),
	password: z
		.string()
		.min(8, { error: "La contraseña debe tener al menos 8 caracteres." }),
});

export const registerSchema = z.object({
	name: z
		.string()
		.min(1, { error: "El nombre es obligatorio." })
		.max(50, { error: "El nombre no puede superar 50 caracteres." }),
	email: z
		.string()
		.min(1, { error: "El correo es obligatorio." })
		.pipe(z.email({ error: "Introduce un correo válido." })),
	password: z
		.string()
		.min(8, { error: "La contraseña debe tener al menos 8 caracteres." }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
