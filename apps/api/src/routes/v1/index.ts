import { Elysia } from "elysia";
import { authRoutes } from "./auth";
import { healthRoutes } from "./health";

export const v1Routes = new Elysia({ prefix: "/v1" })
	.use(authRoutes)
	.use(healthRoutes);
