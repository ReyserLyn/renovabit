import { schemas } from "@renovabit/db/schema";
import { Elysia, t } from "elysia";
import { idParam } from "@/lib/common-schemas";
import { badRequest, forbidden, notFound } from "@/lib/errors";
import { validateRateLimitPlugin } from "@/lib/rate-limit";
import { authRoutes } from "@/modules/auth";
import { adminChangePasswordBody, adminCreateUserBody } from "./user.model";
import { userService } from "./user.service";

export const userController = new Elysia({ prefix: "/users" })
	.use(authRoutes)
	.use(validateRateLimitPlugin)
	.get(
		"/",
		async ({ query }) => {
			const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
			const offset = Math.max(0, Number(query.offset) || 0);
			return userService.findMany({ limit, offset });
		},
		{
			detail: { tags: ["Users"] },
			isAdmin: true,
			query: t.Object({
				limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
				offset: t.Optional(t.Numeric({ minimum: 0 })),
			}),
			response: {
				200: t.Object({
					data: t.Array(schemas.user.select),
					total: t.Number(),
				}),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
			},
		},
	)
	.get(
		"/:id",
		async ({ params: { id }, set }) => {
			const user = await userService.findById(id);
			if (!user) return notFound(set, "Usuario no encontrado");
			return user;
		},
		{
			detail: { tags: ["Users"] },
			isOwnerOrAdmin: true,
			params: idParam,
			response: {
				200: schemas.user.select,
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
				404: t.Object({ message: t.String() }),
			},
		},
	)
	.put(
		"/:id",
		async ({ params: { id }, body, user, set }) => {
			const isAdmin = user!.role === "admin";
			const isOwner = user!.id === id;

			// Campos sensibles que solo los admins pueden modificar
			const sensitiveFields = ["role", "email", "username"] as const;
			const attemptedSensitiveFields = sensitiveFields.filter(
				(field) => body[field] !== undefined,
			);

			// Si un usuario no-admin intenta modificar campos sensibles, rechazar
			if (!isAdmin && attemptedSensitiveFields.length > 0) {
				return forbidden(
					set,
					`No tienes permisos para modificar: ${attemptedSensitiveFields.join(", ")}`,
				);
			}

			if (!isAdmin && !isOwner) {
				return forbidden(set, "Solo puedes modificar tu propio perfil");
			}

			// Filtrar campos permitidos según el rol
			const allowedUpdateData: Partial<typeof body> = {};
			if (isAdmin) {
				// Los admins pueden modificar todos los campos
				Object.assign(allowedUpdateData, body);
			} else {
				// Los usuarios no-admin solo pueden modificar campos no sensibles
				const allowedFields = ["name", "phone", "displayUsername"] as const;
				for (const field of allowedFields) {
					if (body[field] !== undefined) {
						allowedUpdateData[field] =
							body[field] === null ? undefined : body[field];
					}
				}
			}

			const updatedUser = await userService.update(id, allowedUpdateData);
			if (!updatedUser) return notFound(set, "Usuario no encontrado");
			return updatedUser;
		},
		{
			detail: { tags: ["Users"] },
			isOwnerOrAdmin: true,
			params: idParam,
			body: schemas.user.update,
			response: {
				200: schemas.user.select,
				400: t.Object({ message: t.String() }),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
				404: t.Object({ message: t.String() }),
			},
		},
	)
	.delete(
		"/:id",
		async ({ params: { id }, user, set }) => {
			try {
				const deleted = await userService.delete(id, user!.id);
				if (!deleted) return notFound(set, "Usuario no encontrado");
				return { message: "Usuario eliminado correctamente" };
			} catch (error) {
				const message =
					error instanceof Error
						? error.message
						: "Error al eliminar el usuario";
				return badRequest(set, message);
			}
		},
		{
			detail: { tags: ["Users"] },
			isAdmin: true,
			params: idParam,
			response: {
				200: t.Object({ message: t.String() }),
				400: t.Object({ message: t.String() }),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
				404: t.Object({ message: t.String() }),
			},
		},
	)
	.delete(
		"/bulk",
		async ({ body, user, set }) => {
			const MAX_BULK_DELETE = 100;
			if (body.ids.length > MAX_BULK_DELETE) {
				return badRequest(
					set,
					`Máximo ${MAX_BULK_DELETE} usuarios por operación.`,
				);
			}

			try {
				const result = await userService.bulkDelete(body.ids, user!.id);

				if (result.errors.length > 0 && result.deleted.length === 0) {
					return badRequest(
						set,
						result.errors[0]?.message ||
							"No se pudieron eliminar los usuarios.",
						{ details: result.errors },
					);
				}

				if (result.errors.length > 0) {
					set.status = 207;
					return {
						message: `${result.deleted.length} usuario(s) eliminados. ${result.errors.length} usuario(s) no pudieron eliminarse.`,
						deleted: result.deleted.length,
						errors: result.errors,
					};
				}

				return {
					message: `${result.deleted.length} usuario(s) eliminados correctamente`,
					deleted: result.deleted.length,
				};
			} catch (error) {
				const message =
					error instanceof Error
						? error.message
						: "Error al eliminar los usuarios";
				return badRequest(set, message);
			}
		},
		{
			detail: { tags: ["Users"] },
			isAdmin: true,
			body: t.Object({
				ids: t.Array(t.String(), { maxItems: 100 }),
			}),
			response: {
				200: t.Object({
					message: t.String(),
					deleted: t.Number(),
				}),
				207: t.Object({
					message: t.String(),
					deleted: t.Number(),
					errors: t.Array(
						t.Object({
							id: t.String(),
							message: t.String(),
						}),
					),
				}),
				400: t.Object({
					message: t.String(),
					details: t.Optional(
						t.Array(
							t.Object({
								id: t.String(),
								message: t.String(),
							}),
						),
					),
				}),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
			},
		},
	)
	.post(
		"/admin",
		async ({ body, set }) => {
			try {
				const user = await userService.adminCreateUser(body);
				set.status = 201;
				return user;
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "Error al crear el usuario";
				return badRequest(set, message);
			}
		},
		{
			detail: { tags: ["Users"] },
			isAdmin: true,
			body: adminCreateUserBody,
			response: {
				201: schemas.user.select,
				400: t.Object({ message: t.String() }),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
			},
		},
	)
	.post(
		"/validate",
		async ({ body, set }) => {
			const error = await userService.checkUniqueness(body.id, {
				email: body.email,
				username: body.username,
			});

			if (error) return badRequest(set, error);
			return { valid: true };
		},
		{
			detail: { tags: ["Users"] },
			isAdmin: true,
			body: t.Object({
				id: t.Optional(t.String()),
				email: t.Optional(t.String()),
				username: t.Optional(t.String()),
			}),
			response: {
				200: t.Object({ valid: t.Boolean() }),
				400: t.Object({ message: t.String() }),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
			},
		},
	)
	.post(
		"/:id/admin-change-password",
		async ({ params: { id }, body, set }) => {
			try {
				const user = await userService.adminChangePassword(id, body);
				return user;
			} catch (error) {
				const message =
					error instanceof Error
						? error.message
						: "Error al cambiar la contraseña";
				return badRequest(set, message);
			}
		},
		{
			detail: { tags: ["Users"] },
			isAdmin: true,
			params: idParam,
			body: adminChangePasswordBody,
			response: {
				200: schemas.user.select,
				400: t.Object({ message: t.String() }),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
				404: t.Object({ message: t.String() }),
			},
		},
	);
