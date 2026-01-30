import { db, eq } from "@renovabit/db";
import type { Category } from "./category.model";
import { categories } from "./category.model";

export const categoryService = {
	async findManyForNavbar() {
		const all = await db.query.categories.findMany({
			where: (table, { eq, and }) =>
				and(eq(table.showInNavbar, true), eq(table.isActive, true)),
			orderBy: (table, { asc }) => [asc(table.order)],
			with: {
				children: {
					where: (table, { eq }) => eq(table.isActive, true),
					orderBy: (table, { asc }) => [asc(table.order)],
					with: { children: true },
				},
			},
		});
		return all.filter((cat) => !cat.parentId);
	},

	async findMany(): Promise<Category[]> {
		return db.query.categories.findMany({
			orderBy: (table, { asc }) => [asc(table.order)],
		});
	},

	async findByIdOrSlug(id: string) {
		return db.query.categories.findFirst({
			where: (table, { eq, or }) => or(eq(table.id, id), eq(table.slug, id)),
			with: { children: true, parent: true },
		});
	},

	async create(data: typeof categories.$inferInsert) {
		const [row] = await db.insert(categories).values(data).returning();
		return row;
	},

	async update(id: string, data: Partial<typeof categories.$inferInsert>) {
		const [row] = await db
			.update(categories)
			.set(data)
			.where(eq(categories.id, id))
			.returning();
		return row;
	},

	async delete(id: string) {
		const [row] = await db
			.delete(categories)
			.where(eq(categories.id, id))
			.returning();
		return row;
	},
};
