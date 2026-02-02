import { Elysia, t } from "elysia";
import { auth } from "@/modules/auth/auth";
import { authMacro } from "@/modules/auth/middleware";
import { schemas } from "./brand.model";
import { brandService } from "./brand.service";

export const brandController = new Elysia({ prefix: "/brands" })
	.use(authMacro)
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
			response: {
				200: schemas.brand.select,
				404: t.Object({ message: t.String() }),
			},
		},
	)
	.post(
		"/",
		async ({ body }) => {
			try {
				return await brandService.create(body);
			} catch {
				throw new Error("La marca o el slug ya existen.");
			}
		},
		{
			isAdmin: true,
			body: schemas.brand.insert,
			response: {
				200: schemas.brand.select,
				400: t.Object({ message: t.String() }),
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
			response: {
				200: schemas.brand.select,
				400: t.Object({ message: t.String() }),
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
			response: {
				200: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
				404: t.Object({ message: t.String() }),
			},
		},
	);
