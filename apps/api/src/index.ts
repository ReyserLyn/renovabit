/// <reference types="bun-types" />
import { cors } from "@elysiajs/cors";
import { fromTypes, openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import logixlysia from "logixlysia";
import { authRoutes, OpenAPI } from "@/modules/auth/middleware";
import { brandController } from "@/modules/brands/brand.controller";
import { categoryController } from "@/modules/categories/category.controller";
import { healthController } from "@/modules/health/health.controller";
import { productController } from "@/modules/products/product.controller";
import { storageController } from "@/modules/storage/storage.controller";
import { userController } from "@/modules/users/user.controller";
import { auth } from "./modules/auth/auth";

const PORT = process.env.PORT ? Number.parseInt(process.env.PORT) : 3001;
const isProd = process.env.NODE_ENV === "production";

const v1Routes = new Elysia({ prefix: "/v1" })
	.use(authRoutes)
	.use(healthController)
	.use(brandController)
	.use(categoryController)
	.use(productController)
	.use(userController)
	.use(storageController);

const app = new Elysia()
	// Logger
	.use(
		logixlysia({
			config: {
				showStartupMessage: true,
				useColors: !isProd,
				ip: true,
				timestamp: {
					translateTime: "mm-dd-yyyy HH:MM:ss",
				},
				customLogFormat:
					"[+] {now} {level} {duration} {method} {pathname} {status} {message} {ip}",
				logFilePath: "./logs/api.log",
			},
		}),
	)
	// OpenAPI
	.use(
		openapi({
			references: fromTypes("src/index.ts"),
			documentation: {
				info: {
					title: "Renovabit API",
					description: "API documentation for Renovabit",
					version: "1.0.0",
				},
				components: await OpenAPI.components,
				paths: await OpenAPI.getPaths(),
			},
		}),
	)
	// CORS
	.use(
		cors({
			origin: (request) => {
				const origin = request.headers.get("origin");
				const allowedOrigins = [
					process.env.BETTER_AUTH_URL,
					process.env.ADMIN_URL,
					process.env.STORE_URL,
					"http://localhost:3000",
					"http://localhost:3002",
				].filter(Boolean) as string[];

				if (!origin || allowedOrigins.includes(origin)) return true;
				return false;
			},
			allowedHeaders: ["Content-Type", "Authorization"],
			methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
			credentials: true,
		}),
	)
	// Routes
	.group("/api", (api) => api.use(v1Routes))
	// Error Handling
	.onError(({ code, error, set }) => {
		if (code === "NOT_FOUND") {
			set.status = 404;
			return { status: 404, message: "Ruta no encontrada" };
		}

		console.error("[-] API Error:", error);

		const errorMessage =
			error instanceof Error ? error.message : "Error desconocido";

		return {
			status: 500,
			message: isProd ? "Internal server error" : errorMessage,
		};
	})
	// Port
	.listen(PORT);

export type App = typeof app;
export type Session = typeof auth.$Infer.Session;

console.log(`\n[+] Renovabit API is running!`);
console.log(`[+] Mode: ${process.env.NODE_ENV || "development"}`);
console.log(`[+] Local: http://localhost:${PORT}`);
console.log(`[+] OpenAPI: http://localhost:${PORT}/openapi\n`);
