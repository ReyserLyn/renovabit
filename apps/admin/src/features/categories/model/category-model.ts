import { schemas } from "@renovabit/db/schema";
import { z } from "zod";
import { logoFormField } from "@/constants/file-upload";

export const CategorySchema = schemas.category.select;
export const CategoryInsertBodySchema = schemas.category.insert;
export const CategoryUpdateBodySchema = schemas.category.update;

export type Category = z.infer<typeof CategorySchema>;
export type CategoryInsertBody = z.infer<typeof CategoryInsertBodySchema>;
export type CategoryUpdateBody = z.infer<typeof CategoryUpdateBodySchema>;

export const CategoryFormValuesSchema = CategoryInsertBodySchema.extend({
	imageUrl: logoFormField,
});

export type CategoryFormValues = z.infer<typeof CategoryFormValuesSchema>;

export const defaultCategoryFormValues: CategoryFormValues = {
	name: "",
	slug: "",
	isActive: true,
	description: "",
	parentId: null,
	order: 0,
	showInNavbar: true,
	imageUrl: "",
};

export const categoryTreeSchema = CategorySchema.extend({
	parent: CategorySchema.nullable(),
	children: z.array(CategorySchema).optional(),
});

export type CategoryTree = z.infer<typeof categoryTreeSchema>;
