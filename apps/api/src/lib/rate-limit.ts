import { Elysia } from "elysia";
import { rateLimit } from "elysia-rate-limit";

export function getClientIp(request: Request): string {
	return (
		request.headers.get("x-forwarded-for")?.trim().split(",")[0]?.trim() ??
		request.headers.get("x-real-ip") ??
		"unknown"
	);
}

export const validateRateLimitPlugin = new Elysia({
	name: "validate-rate-limit",
}).use(
	rateLimit({
		max: 10,
		duration: 60000,
		generator: (req) => getClientIp(req),
		errorResponse:
			"Demasiadas solicitudes de validación. Intenta de nuevo más tarde.",
		skip: (req) => !new URL(req.url).pathname.endsWith("/validate"),
	}),
);
