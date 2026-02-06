import type { UserUpdateBody } from "@renovabit/db/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AdminUser } from "../model/user-model";
import {
	type AdminChangePasswordBody,
	type AdminCreateUserBody,
	adminChangeUserPassword,
	adminCreateUser,
	bulkDeleteUsers,
	deleteUser,
	updateUser,
	usersKeys,
	usersQueryOptions,
} from "../services/users-service";

export function useUsers() {
	return useQuery(usersQueryOptions());
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
		mutationFn: (body: AdminCreateUserBody) => adminCreateUser(body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usersKeys.all });
		},
	});
}

export function useAdminChangeUserPassword() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, body }: { id: string; body: AdminChangePasswordBody }) =>
			adminChangeUserPassword(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usersKeys.all });
		},
	});
}

export type { AdminUser };
