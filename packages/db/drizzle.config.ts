import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { databaseUrl } from "./index";

export default defineConfig({
	out: "./src/migrations",
	schema: "./src/schema/index.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: databaseUrl,
	},
});
