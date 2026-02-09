import { and, count, db, eq, inArray } from "@renovabit/db";
import { productImages, products } from "@renovabit/db/schema";
import { ConflictError, ValidationError } from "@/lib/errors";
import { storageService } from "@/modules/storage/storage.service";
import type {
	ProductImageInsertBody,
	ProductInsertBody,
	ProductUpdateBody,
} from "./product.model";

export type ListQuery = {
	categoryId?: string;
	brandId?: string;
	featured?: boolean;
	includeInactive?: boolean;
	limit?: number;

	offset?: number;
};

function buildListWhere(query: ListQuery, includeInactive: boolean) {
	const filters: ReturnType<typeof eq>[] = [];

	if (query.categoryId) filters.push(eq(products.categoryId, query.categoryId));
	if (query.brandId) filters.push(eq(products.brandId, query.brandId));
	if (query.featured) filters.push(eq(products.isFeatured, true));
	if (!includeInactive) filters.push(eq(products.status, "active"));

	return filters.length > 0 ? and(...filters) : undefined;
}

export const productService = {
	async findMany(query: ListQuery = {}, includeInactive = false) {
		const whereCondition = buildListWhere(query, includeInactive);

		const [data, totalResult] = await Promise.all([
			db.query.products.findMany({
				where: whereCondition,
				with: {
					images: { orderBy: (table, { asc }) => [asc(table.order)] },
					brand: true,
					category: true,
				},
				orderBy: (table, { desc }) => [desc(table.createdAt)] as const,
				limit: query.limit,
				offset: query.offset,
			}),
			whereCondition
				? db.select({ count: count() }).from(products).where(whereCondition)
				: db.select({ count: count() }).from(products),
		]);

		const total = Number(totalResult[0]?.count ?? 0);
		return { data, total };
	},

	async findByIdOrSlug(id: string, isAdmin = false) {
		return db.query.products.findFirst({
			where: (table, { eq, or, and }) => {
				const isMatch = or(eq(table.id, id), eq(table.slug, id));
				if (isAdmin) return isMatch;

				return and(isMatch, eq(table.status, "active"));
			},
			with: {
				images: { orderBy: (table, { asc }) => [asc(table.order)] },
				brand: true,
				category: true,
			},
		});
	},

	async create(data: ProductInsertBody) {
		const { images, ...productData } = data;
		return db.transaction(async (tx) => {
			const [newProduct] = await tx
				.insert(products)
				.values(productData)
				.returning();

			if (!newProduct) {
				throw new ValidationError("No se pudo crear el producto.");
			}

			const validImages = images?.filter((img) =>
				Boolean((img as ProductImageInsertBody).url),
			) as Array<ProductImageInsertBody & { url: string }> | undefined;
			if (validImages?.length) {
				await tx.insert(productImages).values(
					validImages.map(
						(img, index): ProductImageInsertBody => ({
							...img,
							productId: newProduct.id,
							order: img.order ?? index,
						}),
					),
				);
			}

			const product = await tx.query.products.findFirst({
				where: (table, { eq }) => eq(table.id, newProduct.id),
				with: { images: true, brand: true, category: true },
			});

			if (!product) {
				throw new ValidationError("No se pudo recuperar el producto creado.");
			}

			return product;
		});
	},

	async update(
		id: string,
		data: ProductUpdateBody & {
			images?: Array<Partial<ProductImageInsertBody> & { id?: string }>;
		},
	) {
		const { images, ...productData } = data;

		// 1. Validar unicidad si se actualiza slug o sku
		if (productData.slug || productData.sku) {
			const error = await this.checkUniqueness(id, {
				slug: productData.slug,
				sku: productData.sku,
			});
			if (error) throw new ConflictError(error);
		}

		return db.transaction(async (tx) => {
			// Update product basic info
			if (Object.keys(productData).length > 0) {
				const [updated] = await tx
					.update(products)
					.set(productData)
					.where(eq(products.id, id))
					.returning();

				if (!updated) return null;
			}

			// Handle Images Update if provided
			if (images) {
				const currentImages = await tx.query.productImages.findMany({
					where: (t, { eq }) => eq(t.productId, id),
				});

				const newImageIds = new Set(
					images.filter((img) => img.id).map((img) => img.id),
				);
				const imagesToDelete = currentImages.filter(
					(img) => !newImageIds.has(img.id),
				);

				// 1. Delete removed images
				if (imagesToDelete.length > 0) {
					await tx.delete(productImages).where(
						inArray(
							productImages.id,
							imagesToDelete.map((img) => img.id),
						),
					);

					// Cleanup storage
					for (const img of imagesToDelete) {
						const key = storageService.getKeyFromPublicUrl(img.url);
						if (key) {
							// Fire and forget storage cleanup to not block transaction
							storageService.deleteFile(key).catch((err) => {
								// Loggear error sin bloquear la transacción
								if (process.env.NODE_ENV !== "production") {
									console.error("Error al eliminar archivo de storage:", err);
								}
							});
						}
					}
				}

				// 2. Upsert (Update existing + Insert new)
				for (const [index, img] of images.entries()) {
					const order = img.order ?? index;

					if (img.id && newImageIds.has(img.id)) {
						// Update existing
						await tx
							.update(productImages)
							.set({
								order,
								alt: img.alt,
							})
							.where(eq(productImages.id, img.id));
					} else if (img.url) {
						// Insert new
						await tx.insert(productImages).values({
							productId: id,
							url: img.url,
							alt: img.alt,
							order,
						});
					}
				}
			}

			// Return complete object
			return tx.query.products.findFirst({
				where: (t, { eq }) => eq(t.id, id),
				with: {
					images: { orderBy: (t, { asc }) => [asc(t.order)] },
					brand: true,
					category: true,
				},
			});
		});
	},

	async delete(id: string) {
		const product = await this.findByIdOrSlug(id, true);

		const [row] = await db
			.delete(products)
			.where(eq(products.id, id))
			.returning();

		// Cleanup images
		if (row && product?.images) {
			for (const img of product.images) {
				const key = storageService.getKeyFromPublicUrl(img.url);
				if (key) {
					storageService.deleteFile(key).catch(console.error);
				}
			}
		}

		return row;
	},

	async bulkDelete(ids: string[]) {
		const productsToDelete = await db.query.products.findMany({
			where: (t, { inArray }) => inArray(t.id, ids),
			with: { images: true },
		});

		if (productsToDelete.length === 0) return [];

		await db.delete(products).where(inArray(products.id, ids));

		// Cleanup images
		for (const product of productsToDelete) {
			for (const img of product.images) {
				const key = storageService.getKeyFromPublicUrl(img.url);
				if (key) {
					storageService.deleteFile(key).catch(console.error);
				}
			}
		}

		return productsToDelete; // Returning the deleted objects (or just rows if structure matches)
	},

	async checkUniqueness(
		id: string | undefined,
		data: { slug?: string; sku?: string },
	) {
		const { slug, sku } = data;

		const existing = await db.query.products.findFirst({
			where: (table, { or, and, eq, ne }) => {
				const matches = [];
				if (slug) matches.push(eq(table.slug, slug));
				if (sku) matches.push(eq(table.sku, sku));

				if (matches.length === 0) return undefined;

				const conflict = or(...matches);
				return id ? and(conflict, ne(table.id, id)) : conflict;
			},
		});

		if (existing) {
			if (slug && existing.slug === slug)
				return "El slug del producto ya está en uso.";
			if (sku && existing.sku === sku)
				return "El SKU del producto ya está en uso.";
		}

		return null;
	},
};
