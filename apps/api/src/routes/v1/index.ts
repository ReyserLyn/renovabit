import { Elysia } from "elysia";
import { authRoutes } from "./auth";
import { brandRoutes } from "./brands";
import { categoryRoutes } from "./categories";
import { healthRoutes } from "./health";
import { productRoutes } from "./products";

export const v1Routes = new Elysia({ prefix: "/v1" })
	.use(authRoutes)
	.use(healthRoutes)
	.use(brandRoutes)
	.use(categoryRoutes)
	.use(productRoutes);
