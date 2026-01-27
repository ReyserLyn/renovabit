import { db } from "@renovabit/db";
import {
	NewProductImage,
	productImages,
	products,
	schemas,
} from "@renovabit/db/schema";
import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { authPlugin } from "../../lib/auth-plugin";

export const productRoutes = new Elysia({ prefix: "/products" })
	.use(authPlugin)
	.get(
		"/",
		async ({ query }) => {
			return await db.query.products.findMany({
				where: (table, { eq, and }) => {
					const filters = [];
					if (query.categoryId)
						filters.push(eq(table.categoryId, query.categoryId));
					if (query.brandId) filters.push(eq(table.brandId, query.brandId));
					if (query.featured) filters.push(eq(table.isFeatured, true));
					filters.push(eq(table.status, "active"));
					return and(...filters);
				},
				with: {
					images: {
						orderBy: (table, { asc }) => [asc(table.order)],
						limit: 1,
					},
					brand: true,
				},
				orderBy: (table, { desc }) => [desc(table.createdAt)],
			});
		},
		{
			query: t.Object({
				categoryId: t.Optional(t.String()),
				brandId: t.Optional(t.String()),
				featured: t.Optional(t.Boolean()),
			}),
		},
	)
	.get("/:id", async ({ params: { id }, set }) => {
		const product = await db.query.products.findFirst({
			where: (table, { eq, or }) => or(eq(table.id, id), eq(table.slug, id)),
			with: {
				images: {
					orderBy: (table, { asc }) => [asc(table.order)],
				},
				brand: true,
				category: true,
			},
		});

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

			const { images, ...productData } = body;

			try {
				return await db.transaction(async (tx) => {
					const [newProduct] = await tx
						.insert(products)
						.values(productData)
						.returning();

					if (images && images.length > 0) {
						await tx.insert(productImages).values(
							(images || []).map((img, index) => ({
								...img,
								productId: newProduct.id,
								order: img.order ?? index,
							})) as NewProductImage[],
						);
					}

					return tx.query.products.findFirst({
						where: (table, { eq }) => eq(table.id, newProduct.id),
						with: {
							images: true,
							brand: true,
							category: true,
						},
					});
				});
			} catch (_e) {
				set.status = 400;
				return {
					message: "Could not create product. Check if slug/SKU is unique.",
				};
			}
		},
		{
			auth: true,
			body: schemas.product.insert,
		},
	)
	.put(
		"/:id",
		async ({ params: { id }, body, set, user }) => {
			if (user?.role !== "admin") {
				set.status = 403;
				return { message: "Forbidden" };
			}

			try {
				const [updatedProduct] = await db
					.update(products)
					.set(body)
					.where(eq(products.id, id))
					.returning();

				if (!updatedProduct) {
					set.status = 404;
					return { message: "Product not found" };
				}

				return updatedProduct;
			} catch (_e) {
				set.status = 400;
				return { message: "Could not update product. Check unique fields." };
			}
		},
		{
			auth: true,
			body: schemas.product.update,
		},
	)
	.delete(
		"/:id",
		async ({ params: { id }, set, user }) => {
			if (user?.role !== "admin") {
				set.status = 403;
				return { message: "Forbidden" };
			}

			const [deletedProduct] = await db
				.delete(products)
				.where(eq(products.id, id))
				.returning();

			if (!deletedProduct) {
				set.status = 404;
				return { message: "Product not found" };
			}

			return { message: "Product deleted successfully" };
		},
		{
			auth: true,
		},
	);
