import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import { spreads } from "./_utils_typebox";
import { brands } from "./brands";
import { categories } from "./categories";
import { productImages, products } from "./products";

// Centralizing raw insertions with refinements
const rawInsert = {
	brand: createInsertSchema(brands, {
		name: t.String({ minLength: 1, maxLength: 100 }),
		slug: t.String({ minLength: 1, maxLength: 100 }),
	}),
	category: createInsertSchema(categories, {
		name: t.String({ minLength: 1, maxLength: 255 }),
		slug: t.String({ minLength: 1, maxLength: 255 }),
		imageUrl: t.Optional(t.String({ format: "uri" })),
	}),
	product: createInsertSchema(products, {
		name: t.String({ minLength: 1, maxLength: 255 }),
		slug: t.String({ minLength: 1, maxLength: 255 }),
		sku: t.String({ minLength: 1, maxLength: 100 }),
		price: t.String({ pattern: "^[0-9]+(\\.[0-9]{1,2})?$" }),
		stock: t.Integer({ minimum: 0 }),
	}),
	productImage: createInsertSchema(productImages, {
		url: t.String({ format: "uri" }),
	}),
};

// Spreading properties for fine-grained control if needed
export const models = {
	insert: spreads(rawInsert, "insert"),
	select: spreads(
		{
			brand: brands,
			category: categories,
			product: products,
			productImage: productImages,
		},
		"select",
	),
} as const;

// Exporting finalized schemas for routes
export const schemas = {
	brand: {
		insert: t.Omit(rawInsert.brand, ["id", "createdAt", "updatedAt"]),
		update: t.Partial(
			t.Omit(rawInsert.brand, ["id", "createdAt", "updatedAt"]),
		),
	},
	category: {
		insert: t.Omit(rawInsert.category, ["id", "createdAt", "updatedAt"]),
		update: t.Partial(
			t.Omit(rawInsert.category, ["id", "createdAt", "updatedAt"]),
		),
	},
	product: {
		insert: t.Composite([
			t.Omit(rawInsert.product, ["id", "createdAt", "updatedAt"]),
			t.Object({
				images: t.Optional(
					t.Array(
						t.Partial(
							t.Omit(rawInsert.productImage, ["id", "createdAt", "updatedAt"]),
						),
					),
				),
			}),
		]),
		update: t.Partial(
			t.Omit(rawInsert.product, ["id", "createdAt", "updatedAt"]),
		),
	},
} as const;
