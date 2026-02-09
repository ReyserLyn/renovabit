import { schemas } from "@renovabit/db/schema";
import z from "zod";

export const CategorySchema = schemas.category.select;
export const CategoryInsertBodySchema = schemas.category.insert;
export const CategoryUpdateBodySchema = schemas.category.update;

export type Category = z.infer<typeof CategorySchema>;
export type CategoryInsertBody = z.infer<typeof CategoryInsertBodySchema>;
export type CategoryUpdateBody = z.infer<typeof CategoryUpdateBodySchema>;

export const navbarCategorySchema = z.array(
	CategorySchema.extend({
		parent: CategorySchema.nullable(),
		children: z
			.array(
				CategorySchema.extend({
					children: z.array(CategorySchema).optional(),
				}),
			)
			.optional(),
	}),
);

export const categoryTreeSchema = CategorySchema.extend({
	parent: CategorySchema.nullable(),
	children: z.array(CategorySchema).optional(),
});
