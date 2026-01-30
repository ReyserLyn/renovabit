import { z } from "zod";

export const loginSchema = z.object({
	email: z
		.string()
		.min(1, { error: "El correo es obligatorio." })
		.pipe(z.email({ error: "Introduce un correo válido." })),
	password: z.string().min(1, { error: "La contraseña es obligatoria." }),
});

export const registerSchema = z.object({
	name: z
		.string()
		.min(2, { error: "El nombre debe tener al menos 2 caracteres." }),
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
