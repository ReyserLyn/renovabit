import { schemas } from "@renovabit/db/schema";
import { Elysia, t } from "elysia";
import { idParam } from "@/lib/common-schemas";
import { authRoutes } from "@/modules/auth/middleware";
import { userService } from "./user.service";

export const userController = new Elysia({ prefix: "/users" })
	.use(authRoutes)
	.get("/", async () => userService.findMany(), {
		isAdmin: true,
		response: {
			200: t.Array(schemas.user.select),
			401: t.Object({ message: t.String() }),
			403: t.Object({ message: t.String() }),
		},
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
			if (body.role && user!.role !== "admin") {
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
			params: idParam,
			response: {
				200: t.Object({ message: t.String() }),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
				404: t.Object({ message: t.String() }),
			},
		},
	);
