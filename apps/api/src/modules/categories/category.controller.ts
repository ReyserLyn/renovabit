import { Elysia, t } from "elysia";
import { auth } from "@/modules/auth/auth";
import { authMacro } from "@/modules/auth/middleware";
import { schemas } from "./category.model";
import { categoryService } from "./category.service";

export const categoryController = new Elysia({ prefix: "/categories" })
	.use(authMacro)
	.get("/navbar", () => categoryService.findManyForNavbar())
	.get(
		"/",
		async ({ query, set, request: { headers } }) => {
			if (query.includeInactive) {
				const session = await auth.api.getSession({ headers });
				if (session?.user.role !== "admin") {
					set.status = 403;
					return {
						message: "Forbidden",
					};
				}
				return categoryService.findMany(true);
			}
			return categoryService.findMany(false);
		},
		{
			query: t.Object({
				includeInactive: t.Optional(t.Boolean()),
			}),
		},
	)
	.get("/:id", async ({ params: { id }, set, request: { headers } }) => {
		const session = await auth.api.getSession({ headers });
		const isAdmin = session?.user.role === "admin";

		const category = await categoryService.findByIdOrSlug(id, isAdmin);
		if (!category) {
			set.status = 404;
			return { message: "Categoria no encontrada" };
		}
		return category;
	})
	.post(
		"/",
		async ({ body }) => {
			try {
				return await categoryService.create(body);
			} catch {
				throw new Error(
					"No se pudo crear la categoria. El slug debe ser único.",
				);
			}
		},
		{ isAdmin: true, body: schemas.category.insert },
	)
	.put(
		"/:id",
		async ({ params: { id }, body, set }) => {
			try {
				const updatedCategory = await categoryService.update(id, body);
				if (!updatedCategory) {
					set.status = 404;
					return { message: "Categoria no encontrada" };
				}
				return updatedCategory;
			} catch {
				throw new Error(
					"No se pudo actualizar la categoria. Verifique si el slug es único.",
				);
			}
		},
		{ isAdmin: true, body: schemas.category.update },
	)
	.delete(
		"/:id",
		async ({ params: { id }, set }) => {
			try {
				const deletedCategory = await categoryService.delete(id);
				if (!deletedCategory) {
					set.status = 404;
					return { message: "Categoria no encontrada" };
				}
				return { message: "Categoria eliminada correctamente" };
			} catch {
				throw new Error(
					"No se pudo eliminar la categoria. Puede tener productos hijos.",
				);
			}
		},
		{ isAdmin: true },
	);
