import { schemas } from "@renovabit/db/schema";
import { z } from "zod";
import { logoFormField } from "@/constants/file-upload";

export const BrandSchema = schemas.brand.select;
export const BrandInsertBodySchema = schemas.brand.insert;
export const BrandUpdateBodySchema = schemas.brand.update;

export type Brand = z.infer<typeof BrandSchema>;
export type BrandInsertBody = z.infer<typeof BrandInsertBodySchema>;
export type BrandUpdateBody = z.infer<typeof BrandUpdateBodySchema>;

export const BrandFormValuesSchema = BrandInsertBodySchema.extend({
	logo: logoFormField,
});

export type BrandFormValues = z.infer<typeof BrandFormValuesSchema>;

export const defaultBrandFormValues: BrandInsertBody = {
	name: "",
	slug: "",
	logo: "",
	isActive: true,
};
