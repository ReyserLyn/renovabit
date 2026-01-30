import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./src/schema";

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
	});

if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });

export { and, eq };
