import { db } from "@renovabit/db";
import { brands, schemas } from "@renovabit/db/schema";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { authPlugin } from "../../lib/auth-plugin";

export const brandRoutes = new Elysia({ prefix: "/brands" })
	.use(authPlugin)
	.get("/", async () => {
		return await db.query.brands.findMany({
			where: (table, { eq }) => eq(table.isActive, true),
			orderBy: (table, { asc }) => [asc(table.name)],
		});
	})
	.get("/:id", async ({ params: { id }, set }) => {
		const brand = await db.query.brands.findFirst({
			where: (table, { eq, or }) => or(eq(table.id, id), eq(table.slug, id)),
		});

		if (!brand) {
			set.status = 404;
			return { message: "Brand not found" };
		}

		return brand;
	})
	.post(
		"/",
		async ({ body, set }) => {
			try {
				const [newBrand] = await db.insert(brands).values(body).returning();
				return newBrand;
			} catch (_e) {
				set.status = 400;
				return {
					message: "Could not create brand. Name or slug might already exist.",
				};
			}
		},
		{
			auth: true,
			body: schemas.brand.insert,
		},
	)
	.put(
		"/:id",
		async ({ params: { id }, body, set }) => {
			try {
				const [updatedBrand] = await db
					.update(brands)
					.set(body)
					.where(eq(brands.id, id))
					.returning();

				if (!updatedBrand) {
					set.status = 404;
					return { message: "Brand not found" };
				}

				return updatedBrand;
			} catch (_e) {
				set.status = 400;
				return { message: "Could not update brand. Check if slug is unique." };
			}
		},
		{
			auth: true,
			body: schemas.brand.update,
		},
	)
	.delete(
		"/:id",
		async ({ params: { id }, set }) => {
			const [deletedBrand] = await db
				.delete(brands)
				.where(eq(brands.id, id))
				.returning();

			if (!deletedBrand) {
				set.status = 404;
				return { message: "Brand not found" };
			}

			return { message: "Brand deleted successfully" };
		},
		{
			auth: true,
		},
	);
