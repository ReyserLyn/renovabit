import { Elysia, t } from "elysia";
import { slugOrIdParam } from "@/lib/common-schemas";
import { authRoutes, isAdminUser } from "@/modules/auth/middleware";
import { schemas } from "./product.model";
import { productService } from "./product.service";

export const productController = new Elysia({ prefix: "/products" })
	.use(authRoutes)
	.get(
		"/",
		async ({ query, user }) => {
			const includeInactive =
				Boolean(query.includeInactive) && isAdminUser(user);
			const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
			const offset = Math.max(0, Number(query.offset) || 0);
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
			query: t.Object({
				categoryId: t.Optional(t.String()),
				brandId: t.Optional(t.String()),
				featured: t.Optional(t.Boolean()),
				includeInactive: t.Optional(t.Boolean()),
				limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
				offset: t.Optional(t.Numeric({ minimum: 0 })),
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
			if (!product) {
				set.status = 404;
				return { message: "Producto no encontrado" };
			}
			return product;
		},
		{
			isAuth: false,
			params: slugOrIdParam,
			response: {
				200: schemas.product.select,
				404: t.Object({ message: t.String() }),
			},
		},
	)
	.post(
		"/",
		async ({ body, set }) => {
			try {
				return await productService.create(body);
			} catch (e) {
				set.status = 400;
				const message =
					e instanceof Error
						? e.message
						: "No se pudo crear el producto. Verifique si el slug/SKU es único.";
				return { message };
			}
		},
		{
			isAdmin: true,
			body: schemas.product.insert,
			response: {
				200: schemas.product.select,
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
				const updatedProduct = await productService.update(id, body);
				if (!updatedProduct) {
					set.status = 404;
					return { message: "Producto no encontrado" };
				}
				return updatedProduct;
			} catch (e) {
				set.status = 400;
				const message =
					e instanceof Error
						? e.message
						: "No se pudo actualizar el producto. Verifique si el slug/SKU es único.";
				return { message };
			}
		},
		{
			isAdmin: true,
			body: t.Composite([
				schemas.product.update,
				t.Object({
					images: t.Optional(
						t.Array(
							t.Composite([
								t.Partial(schemas.productImage.insert),
								t.Object({ id: t.Optional(t.String()) }),
							]),
						),
					),
				}),
			]),
			params: slugOrIdParam,
			response: {
				200: schemas.product.select,
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
			if (!deletedProduct) {
				set.status = 404;
				return { message: "Producto no encontrado" };
			}
			return { message: "Producto eliminado correctamente" };
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
	)
	.delete(
		"/bulk",
		async ({ body, set }) => {
			const MAX_BULK_DELETE = 100;
			if (body.ids.length > MAX_BULK_DELETE) {
				set.status = 400;
				return {
					message: `Máximo ${MAX_BULK_DELETE} productos por operación.`,
				};
			}
			try {
				const deletedProducts = await productService.bulkDelete(body.ids);
				return {
					message: `${deletedProducts.length} productos eliminados correctamente`,
				};
			} catch {
				set.status = 400;
				return { message: "No se pudieron eliminar los productos." };
			}
		},
		{
			isAdmin: true,
			body: t.Object({
				ids: t.Array(t.String(), { maxItems: 100 }),
			}),
			response: {
				200: t.Object({ message: t.String() }),
				400: t.Object({ message: t.String() }),
				401: t.Object({ message: t.String() }),
				403: t.Object({ message: t.String() }),
			},
		},
	);
