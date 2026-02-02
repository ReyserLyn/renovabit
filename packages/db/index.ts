import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./src/schema";

export * from "drizzle-orm";
export * from "./src/schema";

if (!process.env.DATABASE_URL) {
	throw new Error("[-] DATABASE_URL no está definida");
}

export const databaseUrl = process.env.DATABASE_URL as string;

const globalForDb = globalThis as unknown as {
	conn: postgres.Sql | undefined;
};

export const conn =
	globalForDb.conn ??
	postgres(databaseUrl, {
		ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
		max: process.env.NODE_ENV === "production" ? 20 : 5,
		idle_timeout: 20,
		connect_timeout: 10,
	});

if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });

export { and, asc, desc, eq, ne, or } from "drizzle-orm";
