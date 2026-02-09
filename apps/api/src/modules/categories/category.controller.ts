import { Elysia, t } from "elysia";
import z from "zod";
import { idParam } from "@/lib/common-schemas";
import { badRequest, forbidden, notFound } from "@/lib/errors";
import { validateRateLimitPlugin } from "@/lib/rate-limit";
import { authRoutes, isAdminUser } from "@/modules/auth";
import {
	CategoryInsertBodySchema,
	CategorySchema,
	CategoryUpdateBodySchema,
	categoryTreeSchema,
	navbarCategorySchema,
} from "./category.model";
import { categoryService } from "./category.service";

export const categoryController = new Elysia({ prefix: "/categories" })
	.use(authRoutes)
	.use(validateRateLimitPlugin)
	.get("/navbar", () => categoryService.getForNavbar(), {
		detail: { tags: ["Categories"] },
	})
	.get(
		"/",
		async ({ query, set, user }) => {
			if (query.includeInactive) {
				if (!isAdminUser(user)) {
					return forbidden(
						set,
						"No tiene permisos para ver categorías inactivas.",
					);
				}
				return categoryService.getAll(true);
			}
			return categoryService.getAll(false);
		},
		{
			detail: { tags: ["Categories"] },
			query: t.Object({
				includeInactive: t.Optional(t.Boolean()),
			}),
			response: {
				200: navbarCategorySchema,
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
			},
		},
	)
	.get(
		"/:id",
		async ({ params: { id }, set, user }) => {
			const category = await categoryService.getByIdOrSlug(
				id,
				isAdminUser(user),
			);
			if (!category) return notFound(set, "Categoría no encontrada");
			return category;
		},
		{
			detail: { tags: ["Categories"] },
			params: idParam,
			response: {
				200: categoryTreeSchema,
				404: t.Object({ message: t.String() }),
			},
		},
	)
	.post(
		"/",
		async ({ body, set }) => {
			try {
				return await categoryService.create(body);
			} catch {
				return badRequest(set, "No se pudo crear la categoría.");
			}
		},
		{
			detail: { tags: ["Categories"] },
			isAdmin: true,
			body: CategoryInsertBodySchema,
			response: {
				200: CategorySchema,
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

				if (!updatedCategory) return notFound(set, "Categoría no encontrada");
				return updatedCategory;
			} catch {
				return badRequest(set, "No se pudo actualizar la categoría.");
			}
		},
		{
			detail: { tags: ["Categories"] },
			isAdmin: true,
			body: CategoryUpdateBodySchema,
			params: idParam,
			response: {
				200: CategorySchema,
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

			if (error) return badRequest(set, error);
			return { valid: true };
		},
		{
			detail: { tags: ["Categories"] },
			isAdmin: true,
			body: z.object({
				id: z.uuidv7().optional(),
				name: z.string().optional(),
				slug: z.string().optional(),
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

				if (!deletedCategory) return notFound(set, "Categoría no encontrada");
				return { message: "Categoría eliminada correctamente" };
			} catch {
				return badRequest(set, "No se pudo eliminar la categoría.");
			}
		},
		{
			detail: { tags: ["Categories"] },
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
		async ({ body, set }) => {
			try {
				const deletedCategories = await categoryService.bulkDelete(body.ids);
				return {
					message: `${deletedCategories.length} categorías eliminadas exitosamente`,
				};
			} catch {
				return badRequest(set, "No se pudieron eliminar las categorías.");
			}
		},
		{
			detail: { tags: ["Categories"] },
			isAdmin: true,
			body: z.object({
				ids: z.array(z.uuidv7()),
			}),
			response: {
				200: t.Object({ message: t.String() }),
				400: t.Object({ message: t.String() }),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
			},
		},
	);
