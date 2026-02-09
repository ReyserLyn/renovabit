import { db, eq, sessions, users } from "@renovabit/db";
import { InternalServerError } from "elysia";
import { NotFoundError } from "@/lib/errors";
import { auth } from "@/modules/auth/auth";
import {
	AdminChangePasswordBody,
	AdminCreateUserBody,
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

		try {
			await auth.api.adminUpdateUser({
				body: {
					userId: id,
					data,
				},
				headers,
			});
			// Devolver el usuario actualizado desde la base de datos
			const updatedUser = await this.getUserById(id);
			if (!updatedUser) {
				throw new NotFoundError("Usuario no encontrado después de actualizar");
			}
			return updatedUser;
		} catch {
			throw new InternalServerError("Error al actualizar el usuario");
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
		} catch {
			throw new InternalServerError("Error al eliminar el usuario");
		}
	},

	async bulkDelete(ids: string[], headers: Headers) {
		if (ids.length === 0) return { deleted: [], errors: [] };

		const deleted: Array<{ id: string }> = [];
		const errors: Array<{ id: string; message: string }> = [];

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
				const message =
					error instanceof Error
						? error.message
						: "Error al eliminar el usuario";
				errors.push({
					id: userId,
					message,
				});
			}
		}

		return { deleted, errors };
	},

	async createUser(data: AdminCreateUserBody, headers: Headers) {
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
		} catch {
			throw new InternalServerError("Error al crear el usuario");
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

		try {
			await auth.api.setUserPassword({
				body: {
					userId: userId,
					newPassword: data.password,
				},
				headers,
			});
			return user;
		} catch {
			throw new InternalServerError("Error al cambiar la contraseña");
		}
	},

	async banUser(
		userId: string,
		headers: Headers,
		options?: { banReason?: string; banExpiresIn?: number },
	) {
		try {
			await auth.api.banUser({
				body: {
					userId,
					banReason: options?.banReason,
					banExpiresIn: options?.banExpiresIn,
				},
				headers,
			});
			// Devolver el usuario actualizado desde la base de datos
			const user = await this.getUserById(userId);
			if (!user) {
				throw new NotFoundError("Usuario no encontrado después de banear");
			}
			return user;
		} catch {
			throw new InternalServerError("Error al banear el usuario");
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
		} catch {
			throw new InternalServerError("Error al desbanear el usuario");
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
			const result = await auth.api.revokeUserSession({
				body: {
					sessionToken,
				},
				headers,
			});
			return result.success;
		} catch {
			throw new InternalServerError("Error al revocar la sesión");
		}
	},

	async revokeAllUserSessions(userId: string, headers: Headers) {
		try {
			const result = await auth.api.revokeUserSessions({
				body: {
					userId,
				},
				headers,
			});
			return result.success;
		} catch {
			throw new InternalServerError("Error al revocar todas las sesiones");
		}
	},
};
