import { and, db, eq } from "@renovabit/db";
import type { NewProduct, NewProductImage } from "@renovabit/db/schema";
import { productImages, products } from "./product.model";

type ListQuery = {
	categoryId?: string;
	brandId?: string;
	featured?: boolean;
	includeInactive?: boolean;
};

export const productService = {
	async findMany(query: ListQuery = {}, includeInactive = false) {
		return db.query.products.findMany({
			where: (table, { eq, and }) => {
				const filters = [];
				if (query.categoryId)
					filters.push(eq(table.categoryId, query.categoryId));
				if (query.brandId) filters.push(eq(table.brandId, query.brandId));
				if (query.featured) filters.push(eq(table.isFeatured, true));

				if (!includeInactive) {
					filters.push(eq(table.status, "active"));
				}

				return filters.length > 0 ? and(...filters) : undefined;
			},
			with: {
				images: {
					orderBy: (table, { asc }) => [asc(table.order)],
					limit: 1,
				},
				brand: true,
			},
			orderBy: (table, { desc }) => [desc(table.createdAt)],
		});
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

	async create(
		data: NewProduct & {
			images?: Array<Partial<NewProductImage>>;
		},
	) {
		const { images, ...productData } = data;
		return db.transaction(async (tx) => {
			const [newProduct] = await tx
				.insert(products)
				.values(productData)
				.returning();

			const validImages = images?.filter(
				(img): img is typeof img & { url: string } => Boolean(img.url),
			);
			if (validImages?.length) {
				await tx.insert(productImages).values(
					validImages.map((img, index) => ({
						...img,
						productId: newProduct.id,
						order: img.order ?? index,
					})) as NewProductImage[],
				);
			}

			const product = await tx.query.products.findFirst({
				where: (table, { eq }) => eq(table.id, newProduct.id),
				with: { images: true, brand: true, category: true },
			});

			if (!product) {
				throw new Error("No se pudo recuperar el producto creado.");
			}

			return product;
		});
	},

	async update(id: string, data: Partial<NewProduct>) {
		const [row] = await db
			.update(products)
			.set(data)
			.where(eq(products.id, id))
			.returning();

		if (!row) return null;

		// Devolver el producto completo con relaciones para que coincida con el schema
		return db.query.products.findFirst({
			where: (table, { eq }) => eq(table.id, id),
			with: { images: true, brand: true, category: true },
		});
	},

	async delete(id: string) {
		const [row] = await db
			.delete(products)
			.where(eq(products.id, id))
			.returning();
		return row;
	},
};
