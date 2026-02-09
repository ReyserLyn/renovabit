import { schemas } from "@renovabit/db/schema";
import z from "zod";

export const BrandSchema = schemas.brand.select;
export const BrandInsertBodySchema = schemas.brand.insert;
export const BrandUpdateBodySchema = schemas.brand.update;

export type Brand = z.infer<typeof BrandSchema>;
export type BrandInsertBody = z.infer<typeof BrandInsertBodySchema>;
export type BrandUpdateBody = z.infer<typeof BrandUpdateBodySchema>;
