import { accounts, count, db, eq, inArray, sql, users } from "@renovabit/db";
import type { NewUser } from "@renovabit/db/schema";
import {
	ConflictError,
	ForbiddenError,
	NotFoundError,
	ValidationError,
} from "@/lib/errors";
import { validatePasswordStrength } from "@/lib/password-validation";
import { auth } from "@/modules/auth/auth";
import type {
	AdminChangePasswordBody,
	AdminCreateUserBody,
} from "./user.model";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

/** Username: una sola palabra, minúsculas, para unicidad y login. */
function normalizeUsername(u: string | undefined | null): string | undefined {
	const firstWord = u?.trim().split(/\s+/)[0];
	return firstWord && firstWord.length > 0
		? firstWord.toLowerCase()
		: undefined;
}

export const userService = {
	async findMany(options?: { limit?: number; offset?: number }) {
		const limit = Math.min(
			Math.max(1, options?.limit ?? DEFAULT_PAGE_SIZE),
			MAX_PAGE_SIZE,
		);
		const offset = Math.max(0, options?.offset ?? 0);

		const [data, totalResult] = await Promise.all([
			db.query.users.findMany({
				orderBy: (table, { desc }) => [desc(table.createdAt)],
				limit,
				offset,
			}),
			db.select({ count: count() }).from(users),
		]);

		const total = Number(totalResult[0]?.count ?? 0);
		return { data, total };
	},

	async findById(id: string) {
		return db.query.users.findFirst({
			where: eq(users.id, id),
		});
	},

	async checkUniqueness(
		id: string | undefined,
		data: { email?: string; username?: string },
	) {
		const email = data.email?.trim() || undefined;
		const username = normalizeUsername(data.username);

		// Timing attack prevention: siempre ejecutar la consulta, incluso si no hay datos
		const startTime = Date.now();

		const existing = await db.query.users.findFirst({
			where: (table, { or, and, eq, ne }) => {
				const matches = [];
				if (email) matches.push(eq(table.email, email));
				if (username) matches.push(sql`LOWER(${table.username}) = ${username}`);

				const conflict = or(...matches);
				return id ? and(conflict, ne(table.id, id)) : conflict;
			},
		});

		const elapsed = Date.now() - startTime;
		if (elapsed < 50) {
			await new Promise((resolve) => setTimeout(resolve, 50 - elapsed));
		}

		if (existing) {
			if (email && existing.email === email) {
				return "Ya existe un usuario con este correo electrónico.";
			}
			if (username && existing.username?.toLowerCase() === username) {
				return "El nombre de usuario ya está en uso. Prueba con otro distinto.";
			}
		}

		return null;
	},

	async update(id: string, data: Partial<NewUser>) {
		if (data.displayUsername?.trim() && /\s/.test(data.displayUsername)) {
			throw new ValidationError(
				"El usuario debe ser una sola palabra (sin espacios).",
			);
		}
		const payload = { ...data };
		if (payload.username !== undefined) {
			payload.username = normalizeUsername(payload.username) ?? undefined;
		}
		const [row] = await db
			.update(users)
			.set(payload)
			.where(eq(users.id, id))
			.returning();
		return row;
	},

	async delete(id: string, currentUserId?: string) {
		const userToDelete = await this.findById(id);
		if (!userToDelete) {
			return null;
		}

		// Prevenir que un admin se elimine a sí mismo
		if (currentUserId && userToDelete.id === currentUserId) {
			throw new ForbiddenError("No puedes eliminarte a ti mismo");
		}

		// Prevenir eliminar el último admin
		if (userToDelete.role === "admin") {
			const adminCount = await db.query.users.findMany({
				where: (table, { eq }) => eq(table.role, "admin"),
			});

			if (adminCount.length <= 1) {
				throw new ForbiddenError(
					"No se puede eliminar el último administrador. Debe haber al menos un administrador en el sistema.",
				);
			}
		}

		const [row] = await db.delete(users).where(eq(users.id, id)).returning();
		return row;
	},

	async bulkDelete(ids: string[], currentUserId: string) {
		if (ids.length === 0) return { deleted: [], errors: [] };

		const usersToDelete = await db.query.users.findMany({
			where: (table, { inArray }) => inArray(table.id, ids),
		});

		const errors: Array<{ id: string; message: string }> = [];

		if (usersToDelete.length === 0) {
			ids.forEach((id) => {
				errors.push({
					id,
					message: "Usuario no encontrado",
				});
			});
			return { deleted: [], errors };
		}

		const notFoundIds = ids.filter(
			(id) => !usersToDelete.some((u) => u.id === id),
		);
		notFoundIds.forEach((id) => {
			errors.push({
				id,
				message: "Usuario no encontrado",
			});
		});

		const adminCount = await db.query.users.findMany({
			where: (table, { eq }) => eq(table.role, "admin"),
		});

		const validIds: string[] = [];

		for (const user of usersToDelete) {
			if (user.id === currentUserId) {
				errors.push({
					id: user.id,
					message: "No puedes eliminarte a ti mismo",
				});
				continue;
			}

			if (user.role === "admin") {
				const remainingAdmins = adminCount.filter((a) => a.id !== user.id);
				if (remainingAdmins.length < 1) {
					errors.push({
						id: user.id,
						message:
							"No se puede eliminar el último administrador. Debe haber al menos un administrador en el sistema.",
					});
					continue;
				}
			}

			validIds.push(user.id);
		}

		if (validIds.length === 0) {
			return { deleted: [], errors };
		}

		const deleted = await db
			.delete(users)
			.where(inArray(users.id, validIds))
			.returning();

		return { deleted, errors };
	},

	/** Crea usuario desde admin (Better Auth, sin autoSignIn). */
	async adminCreateUser(data: AdminCreateUserBody) {
		if (data.displayUsername?.trim() && /\s/.test(data.displayUsername)) {
			throw new ValidationError(
				"El usuario debe ser una sola palabra (sin espacios).",
			);
		}
		// Validar que las contraseñas coincidan
		if (data.password !== data.confirmPassword) {
			throw new ValidationError("Las contraseñas no coinciden");
		}

		// Validar fortaleza de contraseña en backend según el rol
		const passwordValidation = validatePasswordStrength(
			data.password,
			data.role,
		);
		if (!passwordValidation.valid) {
			throw new ValidationError(
				passwordValidation.error || "Contraseña inválida",
			);
		}

		// Verificar si el email ya existe
		const existingUser = await db.query.users.findFirst({
			where: eq(users.email, data.email),
		});

		if (existingUser) {
			throw new ConflictError(
				"Ya existe un usuario con este correo electrónico",
			);
		}

		const normalizedUsername = normalizeUsername(data.username);

		// Verificar si el username ya existe (comparación case-insensitive)
		if (normalizedUsername) {
			const existingByUsername = await db.query.users.findFirst({
				where: sql`LOWER(${users.username}) = ${normalizedUsername}`,
			});

			if (existingByUsername) {
				throw new ConflictError(
					"El nombre de usuario ya está en uso. Prueba con otro distinto.",
				);
			}
		}

		// Crear usuario usando Better Auth API (username se normaliza también en el plugin)
		try {
			const result = await auth.api.signUpEmail({
				body: {
					name: data.name,
					email: data.email,
					password: data.password,
					username: normalizedUsername ?? data.username?.trim() ?? undefined,
					displayUsername: data.displayUsername?.trim() || undefined,
					phone: data.phone,
					role: data.role,
				},
				headers: new Headers(),
			});

			// Retornar el usuario creado (sin contraseña).
			if (!result.user) {
				throw new ValidationError("No se pudo crear el usuario");
			}

			return result.user;
		} catch (error) {
			if (error instanceof ConflictError || error instanceof ValidationError) {
				throw error;
			}
			const msg =
				error instanceof Error ? error.message.toLowerCase() : String(error);

			// Mapear mensajes comunes de Better Auth a español
			if (msg.includes("username is already taken")) {
				throw new ConflictError(
					"El nombre de usuario ya está en uso. Prueba con otro distinto.",
				);
			}

			if (
				msg.includes("email is already in use") ||
				msg.includes("email already")
			) {
				throw new ConflictError(
					"Ya existe un usuario con este correo electrónico.",
				);
			}

			throw new ValidationError(
				"No se pudo crear el usuario. Revisa los datos o prueba con otros diferentes.",
			);
		}
	},

	/** Cambio de contraseña desde admin (Better Auth). */
	async adminChangePassword(userId: string, data: AdminChangePasswordBody) {
		// Validar que las contraseñas coincidan
		if (data.password !== data.confirmPassword) {
			throw new ValidationError("Las contraseñas no coinciden");
		}

		// Verificar que el usuario existe
		const user = await this.findById(userId);
		if (!user) {
			throw new NotFoundError("Usuario no encontrado");
		}

		// Validar fortaleza de contraseña en backend según el rol del usuario
		const passwordValidation = validatePasswordStrength(
			data.password,
			user.role,
		);
		if (!passwordValidation.valid) {
			throw new ValidationError(
				passwordValidation.error || "Contraseña inválida",
			);
		}

		// Buscar la cuenta asociada (donde se guarda la contraseña)
		const account = await db.query.accounts.findFirst({
			where: eq(accounts.userId, userId),
		});

		if (!account) {
			throw new NotFoundError("No se encontró una cuenta asociada al usuario");
		}

		// Hash de la nueva contraseña usando la misma función que Better Auth
		const hashedPassword = await Bun.password.hash(data.password);

		// Actualizar la contraseña en la tabla accounts
		const [updatedAccount] = await db
			.update(accounts)
			.set({ password: hashedPassword })
			.where(eq(accounts.userId, userId))
			.returning();

		if (!updatedAccount) {
			throw new ValidationError("No se pudo actualizar la contraseña");
		}

		// Retornar el usuario actualizado
		return user;
	},
};
