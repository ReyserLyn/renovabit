import { z } from "zod";

export const loginSchema = z.object({
	email: z
		.string()
		.min(1, { message: "El correo es obligatorio." })
		.pipe(z.email({ message: "Introduce un correo válido." })),
	password: z
		.string()
		.min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
});

export const registerSchema = z.object({
	name: z
		.string()
		.min(1, { message: "El nombre es obligatorio." })
		.max(50, { message: "El nombre no puede superar 50 caracteres." }),
	email: z
		.string()
		.min(1, { message: "El correo es obligatorio." })
		.pipe(z.email({ message: "Introduce un correo válido." })),
	password: z
		.string()
		.min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
