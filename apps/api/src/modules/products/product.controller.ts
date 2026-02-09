import { Elysia, t } from "elysia";
import z from "zod";
import { idParam } from "@/lib/common-schemas";
import { badRequest, notFound } from "@/lib/errors";
import { validateRateLimitPlugin } from "@/lib/rate-limit";
import { authRoutes, isAdminUser } from "@/modules/auth";
import {
	ProductImageInsertBodySchema,
	ProductInsertBodySchema,
	ProductSchema,
	ProductUpdateBodySchema,
} from "./product.model";
import { productService } from "./product.service";

export const productController = new Elysia({ prefix: "/products" })
	.use(authRoutes)
	.use(validateRateLimitPlugin)
	.get(
		"/",
		async ({ query, user }) => {
			const includeInactive = !!query.includeInactive && isAdminUser(user);
			const limit = query.limit ?? 20;
			const offset = query.offset ?? 0;

			return productService.findMany(
				{
					categoryId: query.categoryId,
					brandId: query.brandId,
					featured: query.featured,
					includeInactive,
					limit,
					offset,
				},
				includeInactive,
			);
		},
		{
			detail: { tags: ["Products"] },
			query: z.object({
				categoryId: z.uuidv7().optional(),
				brandId: z.uuidv7().optional(),
				featured: z.boolean().optional(),
				includeInactive: z.boolean().optional(),
				limit: z.number().min(1).max(100).optional(),
				offset: z.number().min(0).optional(),
			}),
		},
	)
	.get(
		"/:id",
		async ({ params: { id }, set, user }) => {
			const product = await productService.findByIdOrSlug(
				id,
				isAdminUser(user),
			);

			if (!product) return notFound(set, "Producto no encontrado");
			return product;
		},
		{
			detail: { tags: ["Products"] },
			isAuth: false,
			params: idParam,
			response: {
				200: ProductSchema,
				404: t.Object({ message: t.String() }),
			},
		},
	)
	.post(
		"/",
		async ({ body }) => {
			return await productService.create(body);
		},
		{
			detail: { tags: ["Products"] },
			isAdmin: true,
			body: ProductInsertBodySchema,
			response: {
				200: ProductSchema,
				400: t.Object({ message: t.String() }),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
			},
		},
	)
	.put(
		"/:id",
		async ({ params: { id }, body, set }) => {
			const updatedProduct = await productService.update(id, body);

			if (!updatedProduct) return notFound(set, "Producto no encontrado");
			return updatedProduct;
		},
		{
			detail: { tags: ["Products"] },
			isAdmin: true,
			body: ProductUpdateBodySchema.and(
				z.object({
					images: z
						.array(
							ProductImageInsertBodySchema.partial().extend({
								id: z.string().optional(),
							}),
						)
						.optional(),
				}),
			),
			params: idParam,
			response: {
				200: ProductSchema,
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
			const error = await productService.checkUniqueness(body.id, {
				slug: body.slug,
				sku: body.sku,
			});

			if (error) return badRequest(set, error);

			return { valid: true };
		},
		{
			detail: { tags: ["Products"] },
			isAdmin: true,
			body: t.Object({
				id: t.Optional(t.String()),
				slug: t.Optional(t.String()),
				sku: t.Optional(t.String()),
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
			const deletedProduct = await productService.delete(id);

			if (!deletedProduct) return notFound(set, "Producto no encontrado");
			return { message: "Producto eliminado correctamente" };
		},
		{
			detail: { tags: ["Products"] },
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
				const deletedProducts = await productService.bulkDelete(body.ids);

				return {
					message: `${deletedProducts.length} productos eliminados correctamente`,
				};
			} catch {
				return badRequest(set, "No se pudieron eliminar los productos.");
			}
		},
		{
			detail: { tags: ["Products"] },
			isAdmin: true,
			body: z.object({
				ids: z
					.array(z.uuidv7())
					.max(100, { error: "Máximo 100 productos por operación." })
					.min(1, { error: "Mínimo 1 producto por operación." }),
			}),
			response: {
				200: t.Object({ message: t.String() }),
				400: t.Object({ message: t.String() }),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
			},
		},
	);
