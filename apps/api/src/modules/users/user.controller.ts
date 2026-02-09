import { Elysia, t } from "elysia";
import z from "zod";
import { idParam } from "@/lib/common-schemas";
import { badRequest, notFound } from "@/lib/errors";
import { validateRateLimitPlugin } from "@/lib/rate-limit";
import { authRoutes } from "@/modules/auth";
import {
	AdminChangePasswordBodySchema,
	AdminCreateUserBodySchema,
	UserSchema,
	UserSessionSchema,
	UserUpdateBodySchema,
} from "./user.model";
import { userService } from "./user.service";

export const userController = new Elysia({ prefix: "/users" })
	.use(authRoutes)
	.use(validateRateLimitPlugin)
	.get(
		"/",
		async () => {
			const users = await userService.getUsers();
			return users;
		},
		{
			detail: { tags: ["Users"] },
			isAdmin: true,
			response: {
				200: z.array(UserSchema),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
			},
		},
	)
	.get(
		"/:id",
		async ({ params: { id }, set }) => {
			const user = await userService.getUserById(id);

			if (!user) return notFound(set, "Usuario no encontrado");
			return user;
		},
		{
			detail: { tags: ["Users"] },
			isOwnerOrAdmin: true,
			params: idParam,
			response: {
				200: UserSchema,
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
				404: t.Object({ message: t.String() }),
			},
		},
	)
	.put(
		"/:id",
		async ({ params: { id }, body, set, request }) => {
			const user = await userService.getUserById(id);
			if (!user) return notFound(set, "Usuario no encontrado");

			const headers = new Headers(request.headers);

			return await userService.update(id, body, headers);
		},
		{
			detail: { tags: ["Users"] },
			isOwnerOrAdmin: true,
			params: idParam,
			body: UserUpdateBodySchema,
			response: {
				200: UserSchema,
				400: t.Object({ message: t.String() }),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
				404: t.Object({ message: t.String() }),
			},
		},
	)
	.delete(
		"/:id",
		async ({ params: { id }, set, request }) => {
			const headers = new Headers(request.headers);

			await userService.delete(id, headers);
			return { message: "Usuario eliminado correctamente" };
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
		async ({ body, set, request }) => {
			try {
				const headers = new Headers(request.headers);
				const result = await userService.bulkDelete(body.ids, headers);

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
			} catch {
				throw new Error("Error al eliminar los usuarios");
			}
		},
		{
			detail: { tags: ["Users"] },
			isAdmin: true,
			body: z.object({
				ids: z
					.array(z.uuidv7({ error: "ID inválido" }))
					.max(100, { error: "Máximo 100 usuarios por operación" }),
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
		"/create",
		async ({ body, set, request }) => {
			const headers = new Headers(request.headers);
			const user = await userService.createUser(body, headers);
			set.status = 201;
			return user;
		},
		{
			detail: { tags: ["Users"] },
			isAdmin: true,
			body: AdminCreateUserBodySchema,
			response: {
				201: UserSchema,
				400: t.Object({ message: t.String() }),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
			},
		},
	)
	.post(
		"/:id/admin-change-password",
		async ({ params: { id }, body, request }) => {
			const headers = new Headers(request.headers);
			const user = await userService.adminChangePassword(id, body, headers);
			return user;
		},
		{
			detail: { tags: ["Users"] },
			isAdmin: true,
			params: idParam,
			body: AdminChangePasswordBodySchema,
			response: {
				200: UserSchema,
				400: t.Object({ message: t.String() }),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
				404: t.Object({ message: t.String() }),
			},
		},
	)
	.post(
		"/:id/ban",
		async ({ params: { id }, body, set, request }) => {
			const headers = new Headers(request.headers);
			const user = await userService.banUser(id, headers, {
				banReason: body.banReason,
				banExpiresIn: body.banExpiresIn,
			});
			return user;
		},
		{
			detail: { tags: ["Users"] },
			isAdmin: true,
			params: idParam,
			body: z.object({
				banReason: z.string().optional(),
				banExpiresIn: z.number().optional(),
			}),
			response: {
				200: UserSchema,
				400: t.Object({ message: t.String() }),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
				404: t.Object({ message: t.String() }),
			},
		},
	)
	.post(
		"/:id/unban",
		async ({ params: { id }, set, request }) => {
			const headers = new Headers(request.headers);
			const user = await userService.unbanUser(id, headers);
			return user;
		},
		{
			detail: { tags: ["Users"] },
			isAdmin: true,
			params: idParam,
			response: {
				200: UserSchema,
				400: t.Object({ message: t.String() }),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
				404: t.Object({ message: t.String() }),
			},
		},
	)
	.get(
		"/:id/sessions",
		async ({ params: { id }, request }) => {
			const sessions = await userService.listUserSessions(id);
			return sessions;
		},
		{
			detail: { tags: ["Users"] },
			isAdmin: true,
			params: idParam,
			response: {
				200: z.array(UserSessionSchema),
				400: t.Object({ message: t.String() }),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
				404: t.Object({ message: t.String() }),
			},
		},
	)
	.delete(
		"/sessions/:token",
		async ({ params: { token }, set, request }) => {
			const headers = new Headers(request.headers);
			const success = await userService.revokeUserSession(token, headers);

			return { success, message: "Sesión revocada correctamente" };
		},
		{
			detail: { tags: ["Users"] },
			isAdmin: true,
			params: t.Object({
				token: t.String(),
			}),
			response: {
				200: t.Object({
					success: t.Boolean(),
					message: t.String(),
				}),
				400: t.Object({ message: t.String() }),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
				404: t.Object({ message: t.String() }),
			},
		},
	)
	.delete(
		"/:id/sessions",
		async ({ params: { id }, set, request }) => {
			const headers = new Headers(request.headers);
			const success = await userService.revokeAllUserSessions(id, headers);
			return { success, message: "Todas las sesiones revocadas correctamente" };
		},
		{
			detail: { tags: ["Users"] },
			isAdmin: true,
			params: idParam,
			response: {
				200: t.Object({
					success: t.Boolean(),
					message: t.String(),
				}),
				400: t.Object({ message: t.String() }),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
				404: t.Object({ message: t.String() }),
			},
		},
	);
