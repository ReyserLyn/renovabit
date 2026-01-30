import { sql } from "drizzle-orm";
import { timestamp, uuid } from "drizzle-orm/pg-core";

export const lifecycleDates = {
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
};

export const primaryKey = {
	id: uuid("id").primaryKey().default(sql`uuidv7()`),
};
