import { Elysia, t } from "elysia";
import { authMacro } from "@/modules/auth/middleware";
import { schemas } from "./product.model";
import { productService } from "./product.service";

export const productController = new Elysia({ prefix: "/products" })
	.use(authMacro)
	.get("/", async ({ query }) => productService.findMany(query), {
		query: t.Object({
			categoryId: t.Optional(t.String()),
			brandId: t.Optional(t.String()),
			featured: t.Optional(t.Boolean()),
		}),
	})
	.get("/:id", async ({ params: { id }, set }) => {
		const product = await productService.findByIdOrSlug(id);
		if (!product) {
			set.status = 404;
			return { message: "Product not found" };
		}
		return product;
	})
	.post(
		"/",
		async ({ body, set, user }) => {
			if (user?.role !== "admin") {
				set.status = 403;
				return { message: "Forbidden" };
			}
			try {
				return await productService.create(body);
			} catch {
				set.status = 400;
				return {
					message: "Could not create product. Check if slug/SKU is unique.",
				};
			}
		},
		{ isAuth: true, body: schemas.product.insert },
	)
	.put(
		"/:id",
		async ({ params: { id }, body, set, user }) => {
			if (user?.role !== "admin") {
				set.status = 403;
				return { message: "Forbidden" };
			}
			try {
				const updatedProduct = await productService.update(id, body);
				if (!updatedProduct) {
					set.status = 404;
					return { message: "Product not found" };
				}
				return updatedProduct;
			} catch {
				set.status = 400;
				return { message: "Could not update product. Check unique fields." };
			}
		},
		{ isAuth: true, body: schemas.product.update },
	)
	.delete(
		"/:id",
		async ({ params: { id }, set, user }) => {
			if (user?.role !== "admin") {
				set.status = 403;
				return { message: "Forbidden" };
			}
			const deletedProduct = await productService.delete(id);
			if (!deletedProduct) {
				set.status = 404;
				return { message: "Product not found" };
			}
			return { message: "Product deleted successfully" };
		},
		{ isAuth: true },
	);
