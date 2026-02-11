/// <reference types="bun-types" />
import { cors } from "@elysiajs/cors";
import { fromTypes, openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import { rateLimit } from "elysia-rate-limit";
import {
	ApplicationError,
	type ErrorResponseBody,
	mapDbErrorToResponse,
	rateLimitErrorResponse,
} from "@/lib/errors";
import { logger } from "@/lib/logger";
import { logixPlugin } from "@/lib/logix";
import {
	mergeOpenApiComponents,
	openApiZodMapJsonSchema,
} from "@/lib/openapi-schemas";
import { getClientIp } from "@/lib/rate-limit";
import { securityHeaders } from "@/lib/security-headers";
import { authRoutes, OpenAPI } from "@/modules/auth";
import { auth } from "@/modules/auth/auth";
import { brandController } from "@/modules/brands/brand.controller";
import { categoryController } from "@/modules/categories/category.controller";
import { healthController } from "@/modules/health/health.controller";
import { productController } from "@/modules/products/product.controller";
import { storageController } from "@/modules/storage/storage.controller";
import { userController } from "@/modules/users/user.controller";

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

const allowedOrigins = [
	process.env.BETTER_AUTH_URL,
	process.env.ADMIN_URL,
	process.env.STORE_URL,
	"http://localhost:3000",
	"http://localhost:3001",
	"http://localhost:3002",
	"http://localhost:4002",
].filter(Boolean) as string[];

const app = new Elysia()
	.use(securityHeaders)
	.use(
		cors({
			origin: (request) => {
				const origin = request.headers.get("origin");
				if (!origin) {
					return process.env.NODE_ENV !== "production";
				}
				return allowedOrigins.includes(origin);
			},
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
			credentials: true,
			allowedHeaders: ["Content-Type", "Authorization"],
		}),
	)
	.use(
		rateLimit({
			max: 100,
			duration: 60000,
			generator: getClientIp,
			errorResponse: rateLimitErrorResponse(
				"Demasiadas solicitudes. Intenta de nuevo más tarde.",
			),
		}),
	)
	.use(logixPlugin)
	.use(
		openapi({
			references: fromTypes(
				process.env.NODE_ENV === "production"
					? "dist/index.d.ts"
					: "src/index.ts",
			),
			documentation: {
				info: {
					title: "Renovabit API",
					description: "API documentation for Renovabit",
					version: "1.0.0",
				},
				components: await mergeOpenApiComponents(await OpenAPI.components),
				paths: await OpenAPI.getPaths(),
			},
			mapJsonSchema: openApiZodMapJsonSchema,
		}),
	)
	// Error Handling
	.onError(({ code, error, set }) => {
		if (code === "NOT_FOUND") {
			set.status = 404;
			return {
				code: "ERR_NOT_FOUND",
				message: "Ruta no encontrada",
			} satisfies ErrorResponseBody;
		}

		if (code === "VALIDATION") {
			set.status = 400;
			const validationError = error as { all?: unknown };
			return {
				code: "ERR_VALIDATION",
				message: "Datos inválidos",
				details: { errors: validationError.all },
			} satisfies ErrorResponseBody;
		}

		if (error instanceof ApplicationError) {
			set.status = error.statusCode;
			return {
				code: error.code,
				message: error.message,
				...(error.details !== undefined && { details: error.details }),
			} satisfies ErrorResponseBody;
		}

		const errorCode = `ERR_${code || "UNKNOWN"}`;
		const errorMessage =
			error instanceof Error
				? error.message
				: typeof error === "object" && error !== null && "message" in error
					? String((error as { message: unknown }).message)
					: "";

		logger.error(
			{
				code: errorCode,
				message: isProd ? undefined : errorMessage,
			},
			"API Error",
		);

		const { status, body } = mapDbErrorToResponse(errorMessage, isProd);
		set.status = status;
		return body;
	})
	.group("/api", (api) => api.use(v1Routes))
	.onStart(() => {
		const mode = process.env.NODE_ENV || "development";
		const openapiUrl = `http://localhost:${PORT}/openapi`;
		logger.info(
			{ port: PORT, mode, openapi: openapiUrl },
			"Renovabit API started",
		);
	})
	.listen(PORT);

export type App = typeof app;
export type Session = typeof auth.$Infer.Session;
