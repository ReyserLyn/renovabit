import {
	db,
	eq,
	sessions,
	users,
	validatePasswordForRole,
} from "@renovabit/db";
import { deriveUsername } from "@renovabit/db/schema";
import { InternalServerError } from "elysia";
import { handleAuthError, parseAuthError } from "@/lib/better-auth-errors";
import { ConflictError, NotFoundError, ValidationError } from "@/lib/errors";
import { auth } from "@/modules/auth/auth";
import {
	AdminChangePasswordBody,
	AdminCreateUserBody,
	UserBan,
	UserUpdateBody,
} from "./user.model";

export const userService = {
	async getUsers() {
		return db.query.users.findMany();
	},

	async getUserById(id: string) {
		return db.query.users.findFirst({
			where: eq(users.id, id),
		});
	},

	async update(id: string, data: UserUpdateBody, headers: Headers) {
		const existingUser = await this.getUserById(id);

		if (!existingUser) {
			throw new NotFoundError("Usuario no encontrado");
		}

		// Validar unicidad de email si cambió
		if (data.email !== undefined && data.email !== existingUser.email) {
			const existingByEmail = await db.query.users.findFirst({
				where: eq(users.email, data.email),
			});
			if (existingByEmail) {
				throw new ConflictError(
					"El correo electrónico ya está en uso",
					undefined,
					"EMAIL_ALREADY_IN_USE",
				);
			}
		}

		// Validar unicidad de username si displayUsername cambió
		if (data.displayUsername !== undefined) {
			const newUsername = deriveUsername(data.displayUsername);
			if (newUsername && newUsername !== existingUser.username) {
				const existingByUsername = await db.query.users.findFirst({
					where: eq(users.username, newUsername),
				});
				if (existingByUsername && existingByUsername.id !== id) {
					throw new ConflictError(
						"El nombre de usuario ya está en uso",
						undefined,
						"USERNAME_IS_ALREADY_TAKEN",
					);
				}
			}
		}

		try {
			await auth.api.adminUpdateUser({
				body: {
					userId: id,
					data,
				},
				headers,
			});
			const updatedUser = await this.getUserById(id);
			if (!updatedUser) {
				throw new NotFoundError("Usuario no encontrado después de actualizar");
			}
			return updatedUser;
		} catch (error) {
			handleAuthError(error, "Failed to update user");
		}
	},

	async delete(id: string, headers: Headers) {
		const userToDelete = await this.getUserById(id);

		if (!userToDelete) {
			throw new NotFoundError("Usuario no encontrado");
		}

		try {
			const result = await auth.api.removeUser({
				body: {
					userId: id,
				},
				headers,
			});
			return result;
		} catch (error) {
			handleAuthError(error, "Failed to delete user");
		}
	},

	async bulkDelete(ids: string[], headers: Headers) {
		if (ids.length === 0) return { deleted: [], errors: [] };

		const deleted: Array<{ id: string }> = [];
		const errors: Array<{ id: string; message: string; code?: string }> = [];

		for (const userId of ids) {
			try {
				await auth.api.removeUser({
					body: {
						userId: userId,
					},
					headers,
				});
				deleted.push({ id: userId });
			} catch (error) {
				const { message, code } = parseAuthError(
					error,
					"Failed to delete user",
				);
				errors.push({ id: userId, message, ...(code && { code }) });
			}
		}

		return { deleted, errors };
	},

	async createUser(data: AdminCreateUserBody, headers: Headers) {
		if (data.username) {
			const existingByUsername = await db.query.users.findFirst({
				where: eq(users.username, data.username),
			});
			if (existingByUsername) {
				throw new ConflictError(
					"Username already in use",
					undefined,
					"USERNAME_IS_ALREADY_TAKEN",
				);
			}
		}

		try {
			const result = await auth.api.createUser({
				body: {
					email: data.email,
					password: data.password,
					name: data.name,
					data: {
						username: data.username,
						displayUsername: data.displayUsername,
						phone: data.phone,
						role: data.role,
					},
				},
				headers,
			});

			if (!result.user) {
				throw new InternalServerError("No se pudo crear el usuario");
			}
			return result.user;
		} catch (error) {
			handleAuthError(error, "Failed to create user");
		}
	},

	async adminChangePassword(
		userId: string,
		data: AdminChangePasswordBody,
		headers: Headers,
	) {
		const user = await this.getUserById(userId);

		if (!user) {
			throw new NotFoundError("Usuario no encontrado");
		}

		const pwdCheck = validatePasswordForRole(data.password, user.role);
		if (!pwdCheck.valid) {
			throw new ValidationError(pwdCheck.message);
		}

		try {
			await auth.api.setUserPassword({
				body: {
					userId: userId,
					newPassword: data.password,
				},
				headers,
			});
			return user;
		} catch (error) {
			handleAuthError(error, "Failed to change password");
		}
	},

	async banUser(userId: string, headers: Headers, data: UserBan) {
		try {
			await auth.api.banUser({
				body: {
					userId,
					banReason: data.banReason,
					banExpiresIn: data.banExpiresIn,
				},
				headers,
			});
			const user = await this.getUserById(userId);
			if (!user) {
				throw new NotFoundError("Usuario no encontrado después de banear");
			}
			return user;
		} catch (error) {
			handleAuthError(error, "Failed to ban user");
		}
	},

	async unbanUser(userId: string, headers: Headers) {
		try {
			await auth.api.unbanUser({
				body: {
					userId,
				},
				headers,
			});
			// Devolver el usuario actualizado desde la base de datos
			const user = await this.getUserById(userId);
			if (!user) {
				throw new NotFoundError("Usuario no encontrado después de desbanear");
			}
			return user;
		} catch (error) {
			handleAuthError(error, "Failed to unban user");
		}
	},

	async listUserSessions(userId: string) {
		const user = await this.getUserById(userId);
		if (!user) {
			throw new NotFoundError("Usuario no encontrado");
		}

		return db.query.sessions.findMany({
			where: eq(sessions.userId, userId),
		});
	},

	async revokeUserSession(sessionToken: string, headers: Headers) {
		try {
			const { success } = await auth.api.revokeUserSession({
				body: {
					sessionToken,
				},
				headers,
			});
			return success;
		} catch (error) {
			handleAuthError(error, "Failed to revoke session");
		}
	},

	async revokeAllUserSessions(userId: string, headers: Headers) {
		try {
			const { success } = await auth.api.revokeUserSessions({
				body: {
					userId,
				},
				headers,
			});
			return success;
		} catch (error) {
			handleAuthError(error, "Failed to revoke all sessions");
		}
	},
};
