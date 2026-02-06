import type { UserUpdateBody } from "@renovabit/db/schema";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { api } from "@/libs/eden-client/eden-client";
import { handleEdenError } from "@/libs/eden-client/utils";
import type { AdminUser } from "../model/user-model";

export const usersKeys = {
	all: ["users"] as const,
	detail: (id: string) => ["users", id] as const,
} as const;

export type FetchUsersParams = {
	limit?: number;
	offset?: number;
};

export async function fetchUsers(
	params?: FetchUsersParams,
): Promise<{ data: AdminUser[]; total: number }> {
	const res = await api.api.v1.users.get({
		query: params ?? {},
	});

	if (res.error || !res.data) {
		handleEdenError(res, "Error al cargar usuarios");
	}

	const body = res.data as { data?: AdminUser[]; total?: number };
	return {
		data: Array.isArray(body?.data) ? body.data : [],
		total: typeof body?.total === "number" ? body.total : 0,
	};
}

export async function fetchUser(id: string): Promise<AdminUser | null> {
	const res = await api.api.v1.users({ id }).get();

	if (res.status === 404) return null;
	if (res.error || !res.data) {
		handleEdenError(res, "Error al cargar usuario");
	}

	return res.data as AdminUser;
}

export async function validateUser(params: {
	id?: string;
	email?: string;
	username?: string;
}): Promise<void> {
	const res = await api.api.v1.users.validate.post(params);

	if (res.error || !res.data) {
		handleEdenError(res, "Error en la validación del usuario.");
	}
}

export async function updateUser(
	id: string,
	body: UserUpdateBody,
): Promise<AdminUser> {
	const res = await api.api.v1.users({ id }).put(body);

	if (res.error || !res.data) {
		handleEdenError(res, "Error al actualizar usuario");
	}

	return res.data as AdminUser;
}

export async function deleteUser(id: string): Promise<void> {
	const res = await api.api.v1.users({ id }).delete();

	if (res.error || res.status !== 200) {
		handleEdenError(res, "Error al eliminar usuario");
	}
}

export async function bulkDeleteUsers(ids: string[]): Promise<{
	deleted: number;
	errors?: Array<{ id: string; message: string }>;
}> {
	const res = await api.api.v1.users.bulk.delete({ ids });

	let data: unknown = res.data;
	if (
		!data &&
		res.error &&
		typeof res.error === "object" &&
		"value" in res.error
	) {
		data = res.error.value;
	}

	if (res.status === 207 || res.status === 400) {
		if (
			data &&
			typeof data === "object" &&
			"errors" in data &&
			Array.isArray(data.errors) &&
			data.errors.length > 0
		) {
			return {
				deleted: (data as { deleted?: number }).deleted ?? 0,
				errors: data.errors as Array<{ id: string; message: string }>,
			};
		}
	}

	if (res.status === 400) {
		const message =
			data && typeof data === "object" && "message" in data
				? String(data.message)
				: "No se pudieron eliminar los usuarios";
		throw new Error(message);
	}

	if (res.error) {
		handleEdenError(res, "Error al eliminar usuarios");
	}

	return {
		deleted:
			data && typeof data === "object" && "deleted" in data
				? Number((data as { deleted: number }).deleted)
				: 0,
	};
}

export type AdminCreateUserBody = {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
	phone?: string;
	username?: string;
	displayUsername?: string;
	role: "admin" | "distributor" | "customer";
};

export async function adminCreateUser(
	body: AdminCreateUserBody,
): Promise<AdminUser> {
	const res = await api.api.v1.users.admin.post(body);

	if (res.error || !res.data) {
		handleEdenError(res, "Error al crear usuario");
	}

	return res.data as AdminUser;
}

export type AdminChangePasswordBody = {
	password: string;
	confirmPassword: string;
};

export async function adminChangeUserPassword(
	id: string,
	body: AdminChangePasswordBody,
): Promise<AdminUser> {
	const res = await api.api.v1
		.users({ id })
		["admin-change-password"].post(body);

	if (res.error || !res.data) {
		handleEdenError(res, "Error al cambiar contraseña");
	}

	return res.data as AdminUser;
}

export const usersQueryOptions = (params?: FetchUsersParams) =>
	queryOptions({
		queryKey: [...usersKeys.all, params],
		queryFn: () => fetchUsers(params),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 5,
	});

export const userQueryOptions = (id: string) =>
	queryOptions({
		queryKey: usersKeys.detail(id),
		queryFn: () => fetchUser(id),
		enabled: !!id,
	});
