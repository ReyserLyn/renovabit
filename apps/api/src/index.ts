import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import logixlysia from "logixlysia";
import { v1Routes } from "./routes/v1";

const app = new Elysia()
	// Logger
	.use(
		logixlysia({
			config: {
				showStartupMessage: false,
				useColors: true,
				ip: true,
				timestamp: {
					translateTime: "mm-dd-yyyy HH:MM:ss",
				},
				customLogFormat:
					"🦊 {now} {level} {duration} {method} {pathname} {status} {message} {ip}",
				logFilePath: "./logs/api.log",
				logRotation: {
					maxSize: "100m",
					interval: "1d",
					maxFiles: "30d",
					compress: true,
				},
			},
		}),
	)
	// Swagger
	.use(
		swagger({
			path: "/docs",
			documentation: {
				info: {
					title: "Renovabit API",
					description: "API documentation for Renovabit",
					version: "1.0.0",
				},
			},
		}),
	)
	// CORS
	.use(
		cors({
			origin: [
				process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
				"http://localhost:3000",
				"http://localhost:3002", // Admin panel
				"http://192.168.1.56:3000",
				"http://192.168.1.56:3002", // Admin panel en red local
			],
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
			return { status: 404, message: "Route not found" };
		}
		console.error(error);
		return { status: 500, message: "Internal server error" };
	})
	// Port
	.listen(3001);

export type App = typeof app;

console.log(
	`🚀 Server is running at http://${app.server?.hostname}:${app.server?.port}`,
);
console.log(
	`📚 Swagger UI: http://${app.server?.hostname}:${app.server?.port}/docs`,
);
