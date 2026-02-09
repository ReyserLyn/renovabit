import { Elysia, t } from "elysia";
import z from "zod";
import { idParam } from "@/lib/common-schemas";
import { badRequest, forbidden, notFound } from "@/lib/errors";
import { validateRateLimitPlugin } from "@/lib/rate-limit";
import { authRoutes, isAdminUser } from "@/modules/auth";
import {
	BrandInsertBodySchema,
	BrandSchema,
	BrandUpdateBodySchema,
} from "./brand.model";
import { brandService } from "./brand.service";

export const brandController = new Elysia({ prefix: "/brands" })
	.use(authRoutes)
	.use(validateRateLimitPlugin)
	.get(
		"/",
		async ({ query, set, user }) => {
			if (query.includeInactive) {
				if (!isAdminUser(user)) return forbidden(set, "Forbidden");
				return brandService.findMany(true);
			}

			return brandService.findMany();
		},
		{
			detail: { tags: ["Brands"] },
			query: t.Object({
				includeInactive: t.Optional(t.Boolean()),
			}),
			response: {
				200: z.array(BrandSchema),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
			},
		},
	)
	.get(
		"/:id",
		async ({ params: { id }, set }) => {
			const brand = await brandService.findByIdOrSlug(id);

			if (!brand) return notFound(set, "Marca no encontrada");
			return brand;
		},
		{
			detail: { tags: ["Brands"] },
			params: idParam,
			response: {
				200: BrandSchema,
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
				return badRequest(set, "La marca o el slug ya existen.");
			}
		},
		{
			detail: { tags: ["Brands"] },
			isAdmin: true,
			body: BrandInsertBodySchema,
			response: {
				200: BrandSchema,
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

				if (!updatedBrand) return notFound(set, "Marca no encontrada");
				return updatedBrand;
			} catch {
				return badRequest(set, "La marca o el slug ya están en uso.");
			}
		},
		{
			detail: { tags: ["Brands"] },
			isAdmin: true,
			body: BrandUpdateBodySchema,
			params: idParam,
			response: {
				200: BrandSchema,
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

			if (error) return badRequest(set, error);
			return { valid: true };
		},
		{
			detail: { tags: ["Brands"] },
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
				429: t.Object({ status: t.Number(), message: t.String() }),
			},
		},
	)
	.delete(
		"/:id",
		async ({ params: { id }, set }) => {
			const deletedBrand = await brandService.delete(id);
			if (!deletedBrand) return notFound(set, "Marca no encontrada");
			return { message: "Marca eliminada exitosamente" };
		},
		{
			detail: { tags: ["Brands"] },
			isAdmin: true,
			params: idParam,
			response: {
				200: t.Object({ message: t.String() }),
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
				const deletedBrands = await brandService.bulkDelete(body.ids);
				return {
					message: `${deletedBrands.length} marcas eliminadas exitosamente`,
				};
			} catch {
				return badRequest(set, "No se pudieron eliminar las marcas.");
			}
		},
		{
			detail: { tags: ["Brands"] },
			isAdmin: true,
			body: z.object({
				ids: z.array(z.uuidv7({ error: "ID inválido" })),
			}),
			response: {
				200: t.Object({ message: t.String() }),
				400: t.Object({ message: t.String() }),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
			},
		},
	);
