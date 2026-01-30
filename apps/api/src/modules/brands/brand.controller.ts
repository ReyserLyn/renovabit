import { Elysia } from "elysia";
import { authMacro } from "@/modules/auth/middleware";
import { schemas } from "./brand.model";
import { brandService } from "./brand.service";

export const brandController = new Elysia({ prefix: "/brands" })
	.use(authMacro)
	.get("/", async () => brandService.findMany())
	.get("/:id", async ({ params: { id }, set }) => {
		const brand = await brandService.findByIdOrSlug(id);
		if (!brand) {
			set.status = 404;
			return { message: "Brand not found" };
		}
		return brand;
	})
	.post(
		"/",
		async ({ body, set, user }) => {
			if (user?.role !== "admin") {
				set.status = 403;
				return { message: "Forbidden" };
			}
			try {
				const newBrand = await brandService.create(body);
				return newBrand;
			} catch {
				set.status = 400;
				return {
					message: "Could not create brand. Name or slug might already exist.",
				};
			}
		},
		{ isAuth: true, body: schemas.brand.insert },
	)
	.put(
		"/:id",
		async ({ params: { id }, body, set, user }) => {
			if (user?.role !== "admin") {
				set.status = 403;
				return { message: "Forbidden" };
			}
			try {
				const updatedBrand = await brandService.update(id, body);
				if (!updatedBrand) {
					set.status = 404;
					return { message: "Brand not found" };
				}
				return updatedBrand;
			} catch {
				set.status = 400;
				return { message: "Could not update brand. Check if slug is unique." };
			}
		},
		{ isAuth: true, body: schemas.brand.update },
	)
	.delete(
		"/:id",
		async ({ params: { id }, set, user }) => {
			if (user?.role !== "admin") {
				set.status = 403;
				return { message: "Forbidden" };
			}
			const deletedBrand = await brandService.delete(id);
			if (!deletedBrand) {
				set.status = 404;
				return { message: "Brand not found" };
			}
			return { message: "Brand deleted successfully" };
		},
		{ isAuth: true },
	);
