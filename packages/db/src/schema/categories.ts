import { relations } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import {
	boolean,
	index,
	integer,
	pgTable,
	text,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { lifecycleDates, primaryKey } from "./_utils";

export const categories = pgTable(
	"categories",
	{
		...primaryKey,

		name: varchar("name", { length: 255 }).notNull(),
		slug: varchar("slug", { length: 255 }).notNull().unique(),
		description: text("description"),
		icon: text("icon"),
		imageUrl: text("image_url"),

		// Autoreferencia para anidamiento (Recursivo)
		parentId: uuid("parent_id").references((): AnyPgColumn => categories.id, {
			onDelete: "cascade",
		}),

		// Orden jerárquico para el Navbar
		order: integer("order").default(0).notNull(),

		// UI flags
		showInNavbar: boolean("show_in_navbar").default(true).notNull(),
		isActive: boolean("is_active").notNull().default(true),

		...lifecycleDates,
	},
	(table) => [
		index("categories_slug_idx").on(table.slug),
		index("categories_parent_id_idx").on(table.parentId),
	],
);

export const categoriesRelations = relations(categories, ({ one, many }) => ({
	parent: one(categories, {
		fields: [categories.parentId],
		references: [categories.id],
		relationName: "category_hierarchy",
	}),
	children: many(categories, {
		relationName: "category_hierarchy",
	}),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
