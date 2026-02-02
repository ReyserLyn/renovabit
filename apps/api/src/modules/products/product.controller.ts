import { Elysia, t } from "elysia";
import { slugOrIdParam } from "@/lib/common-schemas";
import { authRoutes, isAdminUser } from "@/modules/auth/middleware";
import { schemas } from "./product.model";
import { productService } from "./product.service";

export const productController = new Elysia({ prefix: "/products" })
	.use(authRoutes)
	.get(
		"/",
		async ({ query, set, user }) => {
			let includeInactive = false;

			if (query.includeInactive) {
				if (!isAdminUser(user)) {
					set.status = 403;
					return {
						message: "Forbidden",
					};
				}
				includeInactive = true;
			}

			return productService.findMany(query, includeInactive);
		},
		{
			query: t.Object({
				categoryId: t.Optional(t.String()),
				brandId: t.Optional(t.String()),
				featured: t.Optional(t.Boolean()),
				includeInactive: t.Optional(t.Boolean()),
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
			} catch {
				set.status = 400;
				return {
					message:
						"No se pudo crear el producto. Verifique si el slug/SKU es único.",
				};
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
			} catch {
				set.status = 400;
				return {
					message:
						"No se pudo actualizar el producto. Verifique si el slug/SKU es único.",
				};
			}
		},
		{
			isAdmin: true,
			body: schemas.product.update,
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
	);
