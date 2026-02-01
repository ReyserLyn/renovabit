import { boolean, index, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { lifecycleDates, primaryKey } from "./_utils";

export const brands = pgTable(
	"brands",
	{
		...primaryKey,

		name: varchar("name", { length: 100 }).notNull().unique(),
		slug: varchar("slug", { length: 100 }).notNull().unique(),

		logo: text("logo"),

		isActive: boolean("is_active").notNull().default(true),

		...lifecycleDates,
	},
	(table) => [index("brands_slug_idx").on(table.slug)],
);

export type Brand = typeof brands.$inferSelect;
