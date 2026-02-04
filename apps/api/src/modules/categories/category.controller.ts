import { Elysia, t } from "elysia";
import { slugOrIdParam } from "@/lib/common-schemas";
import { authRoutes, isAdminUser } from "@/modules/auth/middleware";
import { schemas } from "./category.model";
import { categoryService } from "./category.service";

export const categoryController = new Elysia({ prefix: "/categories" })
	.use(authRoutes)
	.get("/navbar", () => categoryService.findManyForNavbar())
	.get(
		"/",
		async ({ query, set, user }) => {
			if (query.includeInactive) {
				if (!isAdminUser(user)) {
					set.status = 403;
					return {
						message: "No tiene permisos para ver categorías inactivas.",
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
			response: {
				200: t.Array(
					t.Composite([
						schemas.category.select,
						t.Object({
							parent: t.Nullable(schemas.category.select),
							children: t.Optional(
								t.Array(
									t.Composite([
										schemas.category.select,
										t.Object({
											children: t.Optional(t.Array(schemas.category.select)),
										}),
									]),
								),
							),
						}),
					]),
				),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
			},
		},
	)
	.get(
		"/:id",
		async ({ params: { id }, set, user }) => {
			const category = await categoryService.findByIdOrSlug(
				id,
				isAdminUser(user),
			);
			if (!category) {
				set.status = 404;
				return { message: "Categoría no encontrada" };
			}
			return category;
		},
		{
			params: slugOrIdParam,
			response: {
				200: t.Composite([
					schemas.category.select,
					t.Object({
						parent: t.Nullable(schemas.category.select),
						children: t.Optional(t.Array(schemas.category.select)),
					}),
				]),
				404: t.Object({ message: t.String() }),
			},
		},
	)
	.post(
		"/",
		async ({ body, set }) => {
			try {
				return await categoryService.create(body);
			} catch (e) {
				set.status = 400;
				const message =
					e instanceof Error
						? e.message
						: "No se pudo crear la categoria. El slug debe ser único.";
				return { message };
			}
		},
		{
			isAdmin: true,
			body: schemas.category.insert,
			response: {
				200: schemas.category.select,
				400: t.Object({ message: t.String() }),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
			},
		},
	)
	.put(
		"/:id",
		async ({ params: { id }, body, set }) => {
			try {
				const updatedCategory = await categoryService.update(id, body);
				if (!updatedCategory) {
					set.status = 404;
					return { message: "Categoría no encontrada" };
				}
				return updatedCategory;
			} catch (e) {
				set.status = 400;
				const message =
					e instanceof Error
						? e.message
						: "No se pudo actualizar la categoría. Verifique si el slug es único.";
				return { message };
			}
		},
		{
			isAdmin: true,
			body: schemas.category.update,
			params: slugOrIdParam,
			response: {
				200: schemas.category.select,
				400: t.Object({ message: t.String() }),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
				404: t.Object({ message: t.String() }),
			},
		},
	)
	.post(
		"/validate",
		async ({ body, set }) => {
			const error = await categoryService.checkUniqueness(body.id, {
				name: body.name,
				slug: body.slug,
			});

			if (error) {
				set.status = 400;
				return { message: error };
			}

			return { valid: true };
		},
		{
			isAdmin: true,
			body: t.Object({
				id: t.Optional(t.String()),
				name: t.Optional(t.String()),
				slug: t.Optional(t.String()),
			}),
			response: {
				200: t.Object({ valid: t.Boolean() }),
				400: t.Object({ message: t.String() }),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
			},
		},
	)
	.delete(
		"/:id",
		async ({ params: { id }, set }) => {
			try {
				const deletedCategory = await categoryService.delete(id);
				if (!deletedCategory) {
					set.status = 404;
					return { message: "Categoría no encontrada" };
				}
				return { message: "Categoría eliminada correctamente" };
			} catch {
				set.status = 400;
				return {
					message:
						"No se pudo eliminar la categoría. Puede tener productos hijos.",
				};
			}
		},
		{
			isAdmin: true,
			params: slugOrIdParam,
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
		async ({ body, set }) => {
			try {
				const deletedCategories = await categoryService.bulkDelete(body.ids);
				return {
					message: `${deletedCategories.length} categorías eliminadas exitosamente`,
				};
			} catch {
				set.status = 400;
				return { message: "No se pudieron eliminar las categorías." };
			}
		},
		{
			isAdmin: true,
			body: t.Object({
				ids: t.Array(t.String()),
			}),
			response: {
				200: t.Object({ message: t.String() }),
				400: t.Object({ message: t.String() }),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
			},
		},
	);
