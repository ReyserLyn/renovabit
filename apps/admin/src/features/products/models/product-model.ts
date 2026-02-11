import {
	productImageForProductSchema,
	productSpecificationSchema,
	schemas,
} from "@renovabit/db/schema";
import { z } from "zod";
import { logoFormField } from "@/constants/file-upload";

// Productos
export const ProductSchema = schemas.product.select;
export const ProductInsertBodySchema = schemas.product.insert;
export const ProductUpdateBodySchema = schemas.product.update;

export type Product = z.infer<typeof ProductSchema>;
export type ProductInsertBody = z.infer<typeof ProductInsertBodySchema>;
export type ProductUpdateBody = z.infer<typeof ProductUpdateBodySchema>;

// Imágenes de productos
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

// Estados de productos
export const STATUS_LABELS = {
	active: "Activo",
	inactive: "Inactivo",
	out_of_stock: "Agotado",
} as const satisfies Record<Product["status"], string>;

// Especificaciones de productos
export type ProductSpecificationEntry = z.infer<
	typeof productSpecificationSchema
>;

// Formulario de productos
export const ProductFormValuesSchema = ProductInsertBodySchema.extend({
	images: z.array(
		productImageForProductSchema.partial({ url: true }).extend({
			file: logoFormField,
			id: z.uuidv7().optional(),
		}),
	),
});

export type ProductFormValues = z.input<typeof ProductFormValuesSchema>;

// Valores por defecto del formulario de productos
export const defaultProductFormValues: ProductFormValues = {
	name: "",
	slug: "",
	sku: "",
	description: "",
	price: "0.00",
	stock: 0,
	brandId: undefined,
	categoryId: undefined,
	status: "active",
	isFeatured: false,
	specifications: [],
	images: [],
};
