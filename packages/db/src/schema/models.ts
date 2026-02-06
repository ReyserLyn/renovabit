import type { Static } from "@sinclair/typebox";
import { createInsertSchema } from "drizzle-typebox";
import { t } from "elysia";
import { spreads } from "./_utils_typebox";
import { users } from "./auth";
import { brands } from "./brands";
import { categories } from "./categories";
import { productImages, products } from "./products";

const rawInsert = {
	brand: createInsertSchema(brands, {
		name: t.String({ minLength: 1, maxLength: 100 }),
		slug: t.String({ minLength: 1, maxLength: 100 }),
		logo: t.Nullable(t.Optional(t.String({ format: "uri" }))),
	}),
	category: createInsertSchema(categories, {
		name: t.String({ minLength: 1, maxLength: 255 }),
		slug: t.String({ minLength: 1, maxLength: 255 }),
		imageUrl: t.Nullable(t.Optional(t.String({ format: "uri" }))),
		description: t.Nullable(t.Optional(t.String())),
		parentId: t.Nullable(t.Optional(t.String({ format: "uuid" }))),
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
	user: createInsertSchema(users),
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
			user: users,
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
		select: t.Object(models.select.brand),
	},
	category: {
		insert: t.Omit(rawInsert.category, ["id", "createdAt", "updatedAt"]),
		update: t.Partial(
			t.Omit(rawInsert.category, ["id", "createdAt", "updatedAt"]),
		),
		select: t.Object(models.select.category),
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
		select: t.Object(models.select.product),
	},
	productImage: {
		insert: t.Omit(rawInsert.productImage, ["id", "createdAt", "updatedAt"]),
		select: t.Object(models.select.productImage),
	},
	user: {
		select: t.Object(models.select.user),
		update: t.Partial(t.Omit(rawInsert.user, ["id", "createdAt", "updatedAt"])),
		adminCreate: t.Object({
			name: t.String({ minLength: 1, maxLength: 255 }),
			email: t.String({ format: "email", maxLength: 255 }),
			password: t.String({ minLength: 8, maxLength: 100 }),
			confirmPassword: t.String({ minLength: 8, maxLength: 100 }),
			phone: t.Optional(t.String({ maxLength: 50 })),
			username: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
			displayUsername: t.Optional(t.String({ maxLength: 255 })),
			role: t.Union([
				t.Literal("admin"),
				t.Literal("distributor"),
				t.Literal("customer"),
			]),
		}),
		adminChangePassword: t.Object({
			password: t.String({ minLength: 8, maxLength: 100 }),
			confirmPassword: t.String({ minLength: 8, maxLength: 100 }),
		}),
	},
} as const;

export type BrandInsertBody = Static<typeof schemas.brand.insert>;
export type BrandUpdateBody = Static<typeof schemas.brand.update>;

export type CategoryInsertBody = Static<typeof schemas.category.insert>;
export type CategoryUpdateBody = Static<typeof schemas.category.update>;

export type ProductInsertBody = Static<typeof schemas.product.insert>;
export type ProductUpdateBody = Static<typeof schemas.product.update>;

export type UserUpdateBody = Static<typeof schemas.user.update>;
export type AdminCreateUserBody = Static<typeof schemas.user.adminCreate>;
export type AdminChangePasswordBody = Static<
	typeof schemas.user.adminChangePassword
>;
