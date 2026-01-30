import { db, eq } from "@renovabit/db";
import type { Brand } from "./brand.model";
import { brands } from "./brand.model";

export const brandService = {
	async findMany(): Promise<Brand[]> {
		return db.query.brands.findMany({
			where: (table, { eq }) => eq(table.isActive, true),
			orderBy: (table, { asc }) => [asc(table.name)],
		});
	},

	async findByIdOrSlug(id: string) {
		return db.query.brands.findFirst({
			where: (table, { eq, or }) => or(eq(table.id, id), eq(table.slug, id)),
		});
	},

	async create(data: typeof brands.$inferInsert) {
		const [row] = await db.insert(brands).values(data).returning();
		return row;
	},

	async update(id: string, data: Partial<typeof brands.$inferInsert>) {
		const [row] = await db
			.update(brands)
			.set(data)
			.where(eq(brands.id, id))
			.returning();
		return row;
	},

	async delete(id: string) {
		const [row] = await db.delete(brands).where(eq(brands.id, id)).returning();
		return row;
	},
};
