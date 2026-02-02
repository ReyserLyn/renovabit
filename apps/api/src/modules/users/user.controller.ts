import { Elysia, t } from "elysia";
import { authMacro } from "@/modules/auth/middleware";
import { userService } from "./user.service";

export const userController = new Elysia({ prefix: "/users" })
	.use(authMacro)
	.get("/", async () => userService.findMany(), {
		isAdmin: true,
	})
	.get(
		"/:id",
		async ({ params: { id }, set }) => {
			const user = await userService.findById(id);
			if (!user) {
				set.status = 404;
				return { message: "Usuario no encontrado" };
			}
			return user;
		},
		{
			isOwnerOrAdmin: true,
		},
	)
	.put(
		"/:id",
		async ({ params: { id }, body, user, set }) => {
			// Solo administradores pueden cambiar roles
			if (body.role && user.role !== "admin") {
				set.status = 403;
				return { message: "Forbidden" };
			}

			const updatedUser = await userService.update(id, body);
			if (!updatedUser) {
				set.status = 404;
				return { message: "Usuario no encontrado" };
			}
			return updatedUser;
		},
		{
			isOwnerOrAdmin: true,
			body: t.Partial(
				t.Object({
					name: t.String(),
					username: t.String(),
					displayUsername: t.String(),
					phone: t.String(),
					role: t.Union([
						t.Literal("admin"),
						t.Literal("customer"),
						t.Literal("distributor"),
					]),
				}),
			),
		},
	)
	.delete(
		"/:id",
		async ({ params: { id }, set }) => {
			const deleted = await userService.delete(id);
			if (!deleted) {
				set.status = 404;
				return { message: "Usuario no encontrado" };
			}
			return { message: "Usuario eliminado correctamente" };
		},
		{
			isAdmin: true,
		},
	);
