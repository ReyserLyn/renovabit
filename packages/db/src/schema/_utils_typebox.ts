import { Kind, type TObject } from "@sinclair/typebox";
import type { Table } from "drizzle-orm";
import {
	type BuildSchema,
	createInsertSchema,
	createSelectSchema,
} from "drizzle-typebox";

type Spread<
	T extends TObject | Table,
	Mode extends "select" | "insert" | undefined,
> = T extends TObject<infer Fields>
	? {
			[K in keyof Fields]: Fields[K];
		}
	: T extends Table
		? Mode extends "select"
			? BuildSchema<"select", T["_"]["columns"], undefined>["properties"]
			: Mode extends "insert"
				? BuildSchema<"insert", T["_"]["columns"], undefined>["properties"]
				: {}
		: {};

/**
 * Spread a Drizzle schema into a plain object
 */
export const spread = <
	T extends TObject | Table,
	Mode extends "select" | "insert" | undefined,
>(
	schema: T,
	mode?: Mode,
): Spread<T, Mode> => {
	const newSchema: Record<string, unknown> = {};
	let table;

	switch (mode) {
		case "insert":
		case "select":
			if (Kind in schema) {
				table = schema;
				break;
			}

			table =
				mode === "insert"
					? createInsertSchema(schema)
					: createSelectSchema(schema);

			break;

		default:
			if (!(Kind in schema)) throw new Error("Expect a schema");
			table = schema;
	}

	for (const key of Object.keys(table.properties))
		newSchema[key] = table.properties[key];

	// biome-ignore lint/suspicious/noExplicitAny: Standard Typebox utility implementation
	return newSchema as any;
};

/**
 * Spread a Drizzle Table into a plain object
 */
export const spreads = <
	T extends Record<string, TObject | Table>,
	Mode extends "select" | "insert" | undefined,
>(
	models: T,
	mode?: Mode,
): {
	[K in keyof T]: Spread<T[K], Mode>;
} => {
	const newSchema: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(models)) {
		newSchema[key] = spread(value, mode);
	}

	// biome-ignore lint/suspicious/noExplicitAny: Standard Typebox utility implementation
	return newSchema as any;
};
