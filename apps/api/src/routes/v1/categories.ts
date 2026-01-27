import { db } from "@renovabit/db";
import { categories, schemas } from "@renovabit/db/schema";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { authPlugin } from "../../lib/auth-plugin";

export const categoryRoutes = new Elysia({ prefix: "/categories" })
	.use(authPlugin)
	.get("/navbar", async () => {
		const allCategories = await db.query.categories.findMany({
			where: (table, { eq, and }) =>
				and(eq(table.showInNavbar, true), eq(table.isActive, true)),
			orderBy: (table, { asc }) => [asc(table.order)],
			with: {
				children: {
					where: (table, { eq }) => eq(table.isActive, true),
					orderBy: (table, { asc }) => [asc(table.order)],
					with: {
						children: true,
					},
				},
			},
		});

		return allCategories.filter((cat) => !cat.parentId);
	})
	.get("/", async () => {
		return await db.query.categories.findMany({
			orderBy: (table, { asc }) => [asc(table.order)],
		});
	})
	.get("/:id", async ({ params: { id }, set }) => {
		const category = await db.query.categories.findFirst({
			where: (table, { eq, or }) => or(eq(table.id, id), eq(table.slug, id)),
			with: {
				children: true,
				parent: true,
			},
		});

		if (!category) {
			set.status = 404;
			return { message: "Category not found" };
		}

		return category;
	})
	.post(
		"/",
		async ({ body, set }) => {
			try {
				const [newCategory] = await db
					.insert(categories)
					.values(body)
					.returning();
				return newCategory;
			} catch (_e) {
				set.status = 400;
				return { message: "Could not create category. Slug must be unique." };
			}
		},
		{
			auth: true,
			body: schemas.category.insert,
		},
	)
	.put(
		"/:id",
		async ({ params: { id }, body, set }) => {
			try {
				const [updatedCategory] = await db
					.update(categories)
					.set(body)
					.where(eq(categories.id, id))
					.returning();

				if (!updatedCategory) {
					set.status = 404;
					return { message: "Category not found" };
				}

				return updatedCategory;
			} catch (_e) {
				set.status = 400;
				return {
					message: "Could not update category. Check if slug is unique.",
				};
			}
		},
		{
			auth: true,
			body: schemas.category.update,
		},
	)
	.delete(
		"/:id",
		async ({ params: { id }, set }) => {
			try {
				const [deletedCategory] = await db
					.delete(categories)
					.where(eq(categories.id, id))
					.returning();

				if (!deletedCategory) {
					set.status = 404;
					return { message: "Category not found" };
				}

				return { message: "Category deleted successfully" };
			} catch (_e) {
				set.status = 400;
				return {
					message:
						"Could not delete category. It might have children products.",
				};
			}
		},
		{
			auth: true,
		},
	);
