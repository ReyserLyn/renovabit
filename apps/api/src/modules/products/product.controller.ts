import { Elysia, t } from "elysia";
import { auth } from "@/modules/auth/auth";
import { authMacro } from "@/modules/auth/middleware";
import { schemas } from "./product.model";
import { productService } from "./product.service";

export const productController = new Elysia({ prefix: "/products" })
	.use(authMacro)
	.get(
		"/",
		async ({ query, set, request: { headers } }) => {
			let includeInactive = false;

			if (query.includeInactive) {
				const session = await auth.api.getSession({ headers });
				if (session?.user.role !== "admin") {
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
	.get("/:id", async ({ params: { id }, set, request: { headers } }) => {
		const session = await auth.api.getSession({ headers });
		const isAdmin = session?.user.role === "admin";

		const product = await productService.findByIdOrSlug(id, isAdmin);
		if (!product) {
			set.status = 404;
			return { message: "Producto no encontrado" };
		}
		return product;
	})
	.post(
		"/",
		async ({ body }) => {
			try {
				return await productService.create(body);
			} catch {
				throw new Error(
					"No se pudo crear el producto. Verifique si el slug/SKU es único.",
				);
			}
		},
		{ isAdmin: true, body: schemas.product.insert },
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
				throw new Error(
					"No se pudo actualizar el producto. Verifique si el slug/SKU es único.",
				);
			}
		},
		{ isAdmin: true, body: schemas.product.update },
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
		{ isAdmin: true },
	);
