import { relations } from "drizzle-orm";
import {
	boolean,
	decimal,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { lifecycleDates, primaryKey } from "./_utils";
import { brands } from "./brands";
import { categories } from "./categories";

export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json }
	| Json[];

export const productStatusEnum = pgEnum("product_status", [
	"active",
	"inactive",
	"out_of_stock",
]);

export const products = pgTable(
	"products",
	{
		...primaryKey,

		name: varchar("name", { length: 255 }).notNull(),
		slug: varchar("slug", { length: 255 }).notNull().unique(),
		description: text("description"),

		// SKU para identificar versiones o productos únicos de forma rápida
		sku: varchar("sku", { length: 100 }).notNull().unique(),

		// Precio en Soles (PEN). Usamos decimal para precisión monetaria.
		price: decimal("price", { precision: 12, scale: 2 })
			.notNull()
			.default("0.00"),

		// Stock actual
		stock: integer("stock").notNull().default(0),

		// Relaciones
		brandId: uuid("brand_id").references(() => brands.id, {
			onDelete: "set null",
		}),
		categoryId: uuid("category_id").references(() => categories.id, {
			onDelete: "set null",
		}),

		// Especificaciones Técnicas
		specifications: jsonb("specifications").$type<Json>().default({}).notNull(),

		// Control de estado
		status: productStatusEnum("status").default("active").notNull(),

		// UI Flags
		isFeatured: boolean("is_featured").default(false).notNull(),

		...lifecycleDates,
	},
	(table) => [
		index("products_slug_idx").on(table.slug),
		index("products_sku_idx").on(table.sku),
		index("products_status_idx").on(table.status),
	],
);

// Tabla para la galería de imágenes del producto
export const productImages = pgTable(
	"product_images",
	{
		...primaryKey,
		productId: uuid("product_id")
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		url: text("url").notNull(),
		alt: text("alt"),
		order: integer("order").default(0).notNull(),
		...lifecycleDates,
	},
	(table) => [index("product_images_product_id_idx").on(table.productId)],
);

export const productsRelations = relations(products, ({ one, many }) => ({
	brand: one(brands, {
		fields: [products.brandId],
		references: [brands.id],
	}),
	category: one(categories, {
		fields: [products.categoryId],
		references: [categories.id],
	}),
	images: many(productImages),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
	product: one(products, {
		fields: [productImages.productId],
		references: [products.id],
	}),
}));
