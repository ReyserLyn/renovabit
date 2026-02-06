import { db, eq, inArray } from "@renovabit/db";
import type { NewBrand } from "@renovabit/db/schema";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { storageService } from "@/modules/storage/storage.service";
import type { Brand } from "./brand.model";
import { brands } from "./brand.model";

export const brandService = {
	async findMany(includeInactive = false): Promise<Brand[]> {
		return db.query.brands.findMany({
			where: (table, { eq }) =>
				includeInactive ? undefined : eq(table.isActive, true),
			orderBy: (table, { asc }) => [asc(table.name)],
		});
	},

	async findByIdOrSlug(id: string, includeInactive = false) {
		return db.query.brands.findFirst({
			where: (table, { eq, or, and }) => {
				const cond = or(eq(table.id, id), eq(table.slug, id));
				return includeInactive ? cond : and(cond, eq(table.isActive, true));
			},
		});
	},

	async create(data: typeof brands.$inferInsert) {
		const [row] = await db.insert(brands).values(data).returning();
		if (!row) throw new ValidationError("No se pudo crear la marca.");

		return row;
	},

	async update(id: string, data: Partial<NewBrand>) {
		if (data.logo !== undefined) {
			const oldBrand = await this.findByIdOrSlug(id);

			if (oldBrand?.logo && oldBrand.logo !== data.logo) {
				const key = storageService.getKeyFromPublicUrl(oldBrand.logo);
				if (key) {
					await storageService.deleteFile(key).catch(() => {
						/* Cleanup failure is tolerated */
					});
				}
			}
		}

		const [row] = await db
			.update(brands)
			.set(data)
			.where(eq(brands.id, id))
			.returning();

		if (!row) throw new NotFoundError("No se pudo actualizar la marca.");

		return row;
	},

	async checkUniqueness(
		id: string | undefined,
		data: { name?: string; slug?: string },
	) {
		const { name, slug } = data;

		const existing = await db.query.brands.findFirst({
			where: (table, { or, and, eq, ne }) => {
				const matches = [];
				if (name) matches.push(eq(table.name, name));
				if (slug) matches.push(eq(table.slug, slug));

				const conflict = or(...matches);
				return id ? and(conflict, ne(table.id, id)) : conflict;
			},
		});

		if (existing) {
			if (name && existing.name === name)
				return "El nombre ya está registrado.";
			if (slug && existing.slug === slug) return "El slug ya está en uso.";
		}

		return null;
	},

	async delete(id: string) {
		const brand = await this.findByIdOrSlug(id);

		const [row] = await db.delete(brands).where(eq(brands.id, id)).returning();

		if (row && brand?.logo) {
			const key = storageService.getKeyFromPublicUrl(brand.logo);
			if (key) {
				await storageService.deleteFile(key).catch(() => {
					/* Cleanup failure is tolerated */
				});
			}
		}

		return row;
	},

	async bulkDelete(ids: string[]) {
		const brandsToDelete = await db.query.brands.findMany({
			where: (table, { inArray }) => inArray(table.id, ids),
		});

		const rows = await db
			.delete(brands)
			.where(inArray(brands.id, ids))
			.returning();

		for (const brand of brandsToDelete) {
			if (brand.logo) {
				const key = storageService.getKeyFromPublicUrl(brand.logo);
				if (key) {
					await storageService.deleteFile(key).catch(() => {
						/* Cleanup failure is tolerated */
					});
				}
			}
		}

		return rows;
	},
};
