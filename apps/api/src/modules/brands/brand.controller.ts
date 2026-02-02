import { Elysia, t } from "elysia";
import { slugOrIdParam } from "@/lib/common-schemas";
import { authRoutes, isAdminUser } from "@/modules/auth/middleware";
import { schemas } from "./brand.model";
import { brandService } from "./brand.service";

export const brandController = new Elysia({ prefix: "/brands" })
	.use(authRoutes)
	.get(
		"/",
		async ({ query, set, user }) => {
			if (query.includeInactive) {
				if (!isAdminUser(user)) {
					set.status = 403;
					return {
						message: "Forbidden",
					};
				}
				return brandService.findMany(true);
			}
			return brandService.findMany();
		},
		{
			query: t.Object({
				includeInactive: t.Optional(t.Boolean()),
			}),
			response: {
				200: t.Array(schemas.brand.select),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
			},
		},
	)
	.get(
		"/:id",
		async ({ params: { id }, set }) => {
			const brand = await brandService.findByIdOrSlug(id);
			if (!brand) {
				set.status = 404;
				return { message: "Marca no encontrada" };
			}
			return brand;
		},
		{
			params: slugOrIdParam,
			response: {
				200: schemas.brand.select,
				404: t.Object({ message: t.String() }),
			},
		},
	)
	.post(
		"/",
		async ({ body, set }) => {
			try {
				return await brandService.create(body);
			} catch {
				set.status = 400;
				return { message: "La marca o el slug ya existen." };
			}
		},
		{
			isAdmin: true,
			body: schemas.brand.insert,
			response: {
				200: schemas.brand.select,
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
				const updatedBrand = await brandService.update(id, body);
				if (!updatedBrand) {
					set.status = 404;
					return { message: "Marca no encontrada" };
				}
				return updatedBrand;
			} catch {
				set.status = 400;
				return { message: "La marca o el slug ya están en uso." };
			}
		},
		{
			isAdmin: true,
			body: schemas.brand.update,
			params: slugOrIdParam,
			response: {
				200: schemas.brand.select,
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
			const error = await brandService.checkUniqueness(body.id, {
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
			const deletedBrand = await brandService.delete(id);

			if (!deletedBrand) {
				set.status = 404;
				return { message: "Marca no encontrada" };
			}
			return { message: "Marca eliminada exitosamente" };
		},
		{
			isAdmin: true,
			params: slugOrIdParam,
			response: {
				200: t.Object({ message: t.String() }),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
				404: t.Object({ message: t.String() }),
			},
		},
	);
