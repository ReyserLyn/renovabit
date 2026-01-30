import { Elysia } from "elysia";
import { authMacro } from "@/modules/auth/middleware";
import { schemas } from "./category.model";
import { categoryService } from "./category.service";

export const categoryController = new Elysia({ prefix: "/categories" })
	.use(authMacro)
	.get("/navbar", () => categoryService.findManyForNavbar())
	.get("/", () => categoryService.findMany())
	.get("/:id", async ({ params: { id }, set }) => {
		const category = await categoryService.findByIdOrSlug(id);
		if (!category) {
			set.status = 404;
			return { message: "Category not found" };
		}
		return category;
	})
	.post(
		"/",
		async ({ body, set, user }) => {
			if (user?.role !== "admin") {
				set.status = 403;
				return { message: "Forbidden" };
			}
			try {
				const newCategory = await categoryService.create(body);
				return newCategory;
			} catch {
				set.status = 400;
				return { message: "Could not create category. Slug must be unique." };
			}
		},
		{ isAuth: true, body: schemas.category.insert },
	)
	.put(
		"/:id",
		async ({ params: { id }, body, set, user }) => {
			if (user?.role !== "admin") {
				set.status = 403;
				return { message: "Forbidden" };
			}
			try {
				const updatedCategory = await categoryService.update(id, body);
				if (!updatedCategory) {
					set.status = 404;
					return { message: "Category not found" };
				}
				return updatedCategory;
			} catch {
				set.status = 400;
				return {
					message: "Could not update category. Check if slug is unique.",
				};
			}
		},
		{ isAuth: true, body: schemas.category.update },
	)
	.delete(
		"/:id",
		async ({ params: { id }, set, user }) => {
			if (user?.role !== "admin") {
				set.status = 403;
				return { message: "Forbidden" };
			}
			try {
				const deletedCategory = await categoryService.delete(id);
				if (!deletedCategory) {
					set.status = 404;
					return { message: "Category not found" };
				}
				return { message: "Category deleted successfully" };
			} catch {
				set.status = 400;
				return {
					message:
						"Could not delete category. It might have children products.",
				};
			}
		},
		{ isAuth: true },
	);
