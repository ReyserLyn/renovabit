import { deriveUsername } from "@renovabit/db/schema";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { api } from "@/libs/eden-client/eden-client";
import { handleEdenError } from "@/libs/eden-client/utils";
import type {
	User,
	UserAdminChangePassword,
	UserAdminCreateInput,
	UserBan,
	UserSession,
	UserUpdateBody,
} from "../model/user-model";

export const usersKeys = {
	all: ["users"] as const,
	detail: (id: string) => ["users", id] as const,
	sessions: (id: string) => ["users", id, "sessions"] as const,
} as const;

export async function fetchUsers(): Promise<User[]> {
	const res = await api.api.v1.users.get();

	if (res.error) {
		handleEdenError(res, "Error al cargar usuarios");
	}

	return res.data ?? [];
}

export async function fetchUser(id: string): Promise<User | null> {
	const res = await api.api.v1.users({ id }).get();

	if (res.status === 404) return null;

	if (res.error) {
		handleEdenError(res, "Error al cargar usuario");
	}

	return res.data;
}

export async function updateUser(
	id: string,
	body: UserUpdateBody,
): Promise<User> {
	const res = await api.api.v1.users({ id }).put(body);

	if (res.error || !res.data) {
		handleEdenError(res, "Error al actualizar usuario");
	}

	return res.data;
}

export async function deleteUser(id: string): Promise<void> {
	const res = await api.api.v1.users({ id }).delete();

	if (res.error || res.status !== 200) {
		handleEdenError(res, "Error al eliminar usuario");
	}
}

export type BulkDeleteUsersResult = {
	deleted: number;
	errors?: Array<{ id: string; message: string }>;
};

export async function bulkDeleteUsers(
	ids: string[],
): Promise<BulkDeleteUsersResult> {
	const res = await api.api.v1.users.bulk.delete({ ids });

	if (res.error && res.status !== 207 && res.status !== 400) {
		handleEdenError(res, "Error al eliminar usuarios");
	}

	const data = res.data;

	if (res.status === 207 && data && "errors" in data && data.errors) {
		return {
			deleted: "deleted" in data ? Number(data.deleted) : 0,
			errors: data.errors,
		};
	}

	if (res.status === 400) {
		const message =
			data && typeof data === "object" && "message" in data
				? String(data.message)
				: "No se pudieron eliminar los usuarios.";
		throw new Error(message);
	}

	return {
		deleted:
			data && typeof data === "object" && "deleted" in data
				? Number(data.deleted)
				: 0,
	};
}

export async function adminCreateUser(body: UserAdminCreateInput) {
	const payload = {
		...body,
		username: deriveUsername(body.displayUsername),
	};
	const res = await api.api.v1.users.create.post(payload);

	if (res.error || !res.data) {
		handleEdenError(res, "Error al crear usuario");
	}

	return res.data;
}

export async function adminChangeUserPassword(
	id: string,
	body: UserAdminChangePassword,
): Promise<User> {
	const res = await api.api.v1
		.users({ id })
		["admin-change-password"].post(body);

	if (res.error || !res.data) {
		handleEdenError(res, "Error al cambiar contraseña");
	}

	return res.data;
}

export async function banUser(id: string, body: UserBan): Promise<User> {
	const res = await api.api.v1.users({ id }).ban.post(body);

	if (res.error || !res.data) {
		handleEdenError(res, "Error al banear usuario");
	}

	return res.data;
}

export async function unbanUser(id: string): Promise<User> {
	const res = await api.api.v1.users({ id }).unban.post();

	if (res.error || !res.data) {
		handleEdenError(res, "Error al desbanear usuario");
	}

	return res.data;
}

export async function listUserSessions(id: string): Promise<UserSession[]> {
	const res = await api.api.v1.users({ id }).sessions.get();

	if (res.error) {
		handleEdenError(res, "Error al obtener sesiones");
	}

	return res.data;
}

export async function revokeUserSession(token: string): Promise<void> {
	const res = await api.api.v1.users.sessions({ token }).delete();

	if (res.error || res.status !== 200) {
		handleEdenError(res, "Error al revocar sesión");
	}
}

export async function revokeAllUserSessions(id: string): Promise<void> {
	const res = await api.api.v1.users({ id }).sessions.delete();

	if (res.error || res.status !== 200) {
		handleEdenError(res, "Error al revocar sesiones");
	}
}

export const usersQueryOptions = () =>
	queryOptions({
		queryKey: usersKeys.all,
		queryFn: fetchUsers,
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60 * 5,
	});

export const userQueryOptions = (id: string) =>
	queryOptions({
		queryKey: usersKeys.detail(id),
		queryFn: () => fetchUser(id),
		enabled: !!id,
	});

export const listUserSessionsQueryOptions = (id: string) =>
	queryOptions({
		queryKey: usersKeys.sessions(id),
		queryFn: () => listUserSessions(id),
		enabled: !!id,
	});
