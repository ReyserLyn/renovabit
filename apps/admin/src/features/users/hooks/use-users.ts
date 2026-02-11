import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
	User,
	UserAdminChangePassword,
	UserAdminCreateInput,
	UserBan,
	UserUpdateBody,
} from "../model/user-model";
import {
	adminChangeUserPassword,
	adminCreateUser,
	banUser,
	bulkDeleteUsers,
	deleteUser,
	listUserSessionsQueryOptions,
	revokeAllUserSessions,
	revokeUserSession,
	unbanUser,
	updateUser,
	usersKeys,
	usersQueryOptions,
} from "../services/users-service";

export function useUsers() {
	return useQuery(usersQueryOptions());
}

export function useListUserSessions(userId: string) {
	return useQuery(listUserSessionsQueryOptions(userId));
}

export function useUpdateUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, body }: { id: string; body: UserUpdateBody }) =>
			updateUser(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usersKeys.all });
		},
	});
}

export function useDeleteUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteUser(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usersKeys.all });
		},
	});
}

export function useBulkDeleteUsers() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: bulkDeleteUsers,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usersKeys.all });
		},
	});
}

export function useAdminCreateUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: UserAdminCreateInput) => adminCreateUser(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usersKeys.all });
		},
	});
}

export function useAdminChangeUserPassword() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, body }: { id: string; body: UserAdminChangePassword }) =>
			adminChangeUserPassword(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usersKeys.all });
		},
	});
}

export function useBanUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, body }: { id: string; body: UserBan }) =>
			banUser(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usersKeys.all });
		},
	});
}

export function useUnbanUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => unbanUser(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usersKeys.all });
		},
	});
}

export function useRevokeUserSession(userId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (token: string) => revokeUserSession(token),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usersKeys.sessions(userId) });
		},
	});
}

export function useRevokeAllUserSessions(userId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => revokeAllUserSessions(userId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usersKeys.sessions(userId) });
		},
	});
}

export type { User };
