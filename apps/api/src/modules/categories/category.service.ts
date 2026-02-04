import { db, eq, inArray } from "@renovabit/db";
import type { NewCategory } from "@renovabit/db/schema";
import { storageService } from "@/modules/storage/storage.service";
import { categories } from "./category.model";

export const categoryService = {
	async findManyForNavbar() {
		const all = await db.query.categories.findMany({
			where: (table, { eq, and }) =>
				and(eq(table.showInNavbar, true), eq(table.isActive, true)),
			orderBy: (table, { asc }) => [asc(table.order), asc(table.name)],
			with: {
				children: {
					where: (table, { eq }) => eq(table.isActive, true),
					orderBy: (table, { asc }) => [asc(table.order), asc(table.name)],
					with: { children: true },
				},
			},
		});
		return all.filter((cat) => !cat.parentId);
	},

	async findMany(includeInactive = false) {
		return db.query.categories.findMany({
			where: (table, { eq }) =>
				includeInactive ? undefined : eq(table.isActive, true),
			orderBy: (table, { asc }) => [asc(table.order), asc(table.name)],
			with: { parent: true },
		});
	},

	async findByIdOrSlug(id: string, includeInactive = false) {
		return db.query.categories.findFirst({
			where: (table, { eq, or, and }) => {
				const cond = or(eq(table.id, id), eq(table.slug, id));
				return includeInactive ? cond : and(cond, eq(table.isActive, true));
			},
			with: { children: true, parent: true },
		});
	},

	async create(data: typeof categories.$inferInsert) {
		if (data.isActive === false) {
			data.showInNavbar = false;
		}

		// Validate Hierarchy
		if (data.parentId) {
			await this.validateParentChange(null, data.parentId);
		}

		const [row] = await db.insert(categories).values(data).returning();
		if (!row) throw new Error("No se pudo crear la categoría.");
		return row;
	},

	async update(id: string, data: Partial<NewCategory>) {
		const oldCategory = await this.findByIdOrSlug(id, true);

		// Validate Hierarchy changes
		if (
			data.parentId !== undefined &&
			data.parentId !== oldCategory?.parentId
		) {
			await this.validateParentChange(id, data.parentId);
		}

		// 1. Consistency Logic: Inactive => Not in Navbar
		const willBeActive = data.isActive ?? oldCategory?.isActive;
		if (willBeActive === false) {
			data.showInNavbar = false;
		}

		// 2. Cascade Logic (Recursive)
		const recursions: Promise<unknown>[] = [];

		if (data.isActive === false) {
			recursions.push(this.propagateStatusToChildren(id, "isActive", false));
		}

		const willShowInNavbar = data.showInNavbar ?? oldCategory?.showInNavbar;
		if (willShowInNavbar === false) {
			recursions.push(
				this.propagateStatusToChildren(id, "showInNavbar", false),
			);
		}

		// Cleanup old image if changed
		if (
			data.imageUrl !== undefined &&
			oldCategory?.imageUrl &&
			oldCategory.imageUrl !== data.imageUrl
		) {
			const key = storageService.getKeyFromPublicUrl(oldCategory.imageUrl);
			if (key) {
				await storageService.deleteFile(key).catch(() => {
					/* Cleanup failure is tolerated */
				});
			}
		}

		const [row] = await db
			.update(categories)
			.set(data)
			.where(eq(categories.id, id))
			.returning();

		if (!row) throw new Error("No se pudo actualizar la categoría.");

		// Execute recursions after successful update
		await Promise.all(recursions);

		return row;
	},

	// Helper for recursive updates using BFS
	async propagateStatusToChildren(
		parentId: string,
		field: "isActive" | "showInNavbar",
		value: boolean,
	) {
		// Find direct children
		const children = await db.query.categories.findMany({
			columns: { id: true },
			where: (table, { eq }) => eq(table.parentId, parentId),
		});

		if (children.length === 0) return;

		const ids = children.map((c) => c.id);

		// Update direct children
		await db
			.update(categories)
			.set({ [field]: value })
			.where(inArray(categories.id, ids));

		// Recurse for grandchildren
		await Promise.all(
			ids.map((id) => this.propagateStatusToChildren(id, field, value)),
		);
	},

	async checkUniqueness(
		id: string | undefined,
		data: { name?: string; slug?: string },
	) {
		const { name, slug } = data;

		const existing = await db.query.categories.findFirst({
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
				return "El nombre de la categoría ya está en uso.";
			if (slug && existing.slug === slug)
				return "El slug de la categoría ya está en uso.";
		}

		return null;
	},

	async delete(id: string) {
		const category = await this.findByIdOrSlug(id, true);

		const [row] = await db
			.delete(categories)
			.where(eq(categories.id, id))
			.returning();

		if (row && category?.imageUrl) {
			const key = storageService.getKeyFromPublicUrl(category.imageUrl);
			if (key) {
				await storageService.deleteFile(key).catch(() => {
					/* Cleanup failure is tolerated */
				});
			}
		}

		return row;
	},

	async bulkDelete(ids: string[]) {
		const categoriesToDelete = await db.query.categories.findMany({
			where: (table, { inArray }) => inArray(table.id, ids),
		});

		const rows = await db
			.delete(categories)
			.where(inArray(categories.id, ids))
			.returning();

		for (const cat of categoriesToDelete) {
			if (cat.imageUrl) {
				const key = storageService.getKeyFromPublicUrl(cat.imageUrl);
				if (key) {
					await storageService.deleteFile(key).catch(() => {
						/* Cleanup failure is tolerated */
					});
				}
			}
		}

		return rows;
	},

	async validateParentChange(
		targetId: string | null,
		newParentId: string | null,
	) {
		if (!newParentId) return;

		// 1. Check for basic self-reference
		if (targetId && newParentId === targetId) {
			throw new Error("Una categoría no puede ser su propio padre.");
		}

		// 2. Check for Circular Dependency
		let currentParentId: string | null = newParentId;

		let iterations = 0;
		const MAX_ITERATIONS = 100;

		while (currentParentId && iterations < MAX_ITERATIONS) {
			iterations++;
			if (targetId && currentParentId === targetId) {
				throw new Error(
					"No se puede mover una categoría dentro de sus propios hijos.",
				);
			}

			const parent = await db.query.categories.findFirst({
				columns: { parentId: true },
				where: (t, { eq }) => eq(t.id, currentParentId!),
			});

			if (!parent) break;
			currentParentId = parent.parentId;
		}
	},
};
