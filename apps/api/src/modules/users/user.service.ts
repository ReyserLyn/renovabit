import { db, eq, users } from "@renovabit/db";
import type { NewUser } from "@renovabit/db/schema";

export const userService = {
	async findMany() {
		return db.query.users.findMany({
			orderBy: (table, { desc }) => [desc(table.createdAt)],
		});
	},

	async findById(id: string) {
		return db.query.users.findFirst({
			where: eq(users.id, id),
		});
	},

	async update(id: string, data: Partial<NewUser>) {
		const [row] = await db
			.update(users)
			.set(data)
			.where(eq(users.id, id))
			.returning();
		return row;
	},

	async delete(id: string) {
		const [row] = await db.delete(users).where(eq(users.id, id)).returning();
		return row;
	},
};
