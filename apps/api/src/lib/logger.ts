import { mkdirSync } from "node:fs";
import pino from "pino";
import pretty from "pino-pretty";

const isProd = process.env.NODE_ENV === "production";
const opts = {
	level: process.env.LOG_LEVEL || "info",
	redact: {
		paths: [
			"password",
			"token",
			"secret",
			"authorization",
			"cookie",
			"*.password",
			"*.token",
			"*.secret",
			"*.authorization",
		],
		censor: "[REDACTED]",
	},
	base: { service: "renovabit-api", environment: process.env.NODE_ENV },
};

const consoleDest = isProd
	? pino.destination(1)
	: pretty({
			colorize: true,
			translateTime: "HH:MM:ss Z",
			ignore: "pid,hostname",
			sync: true,
		});

mkdirSync("./logs", { recursive: true });
const fileDest = pino.destination({
	dest: "./logs/api.log",
	append: true,
	mkdir: true,
});

export const logger = pino(opts, pino.multistream([consoleDest, fileDest]));
export const auditLogger = logger.child({ service: "audit" });
