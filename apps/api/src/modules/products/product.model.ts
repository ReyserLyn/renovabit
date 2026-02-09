import { schemas } from "@renovabit/db/schema";
import z from "zod";

export const ProductSchema = schemas.product.select;
export const ProductInsertBodySchema = schemas.product.insert;
export const ProductUpdateBodySchema = schemas.product.update;

export type Product = z.infer<typeof ProductSchema>;
export type ProductInsertBody = z.infer<typeof ProductInsertBodySchema>;
export type ProductUpdateBody = z.infer<typeof ProductUpdateBodySchema>;

export const ProductImageSchema = schemas.productImage.select;
export const ProductImageInsertBodySchema = schemas.productImage.insert;
export const ProductImageUpdateBodySchema = schemas.productImage.update;

export type ProductImage = z.infer<typeof ProductImageSchema>;
export type ProductImageInsertBody = z.infer<
	typeof ProductImageInsertBodySchema
>;
export type ProductImageUpdateBody = z.infer<
	typeof ProductImageUpdateBodySchema
>;
