import { Add01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@renovabit/ui/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { AuthenticatedHeader } from "@/components/layout/authenticated-header";
import { PageHeader } from "@/components/layout/page-header";
import { PrimaryActionButton } from "@/components/layout/primary-action-button";
import { DataTableBulkCopyAction } from "@/components/table/bulk-copy-action";
import { DataTableBulkDeleteAction } from "@/components/table/bulk-delete-action";
import { DataTable } from "@/components/table/data-table";
import { TableSkeleton } from "@/components/table/table-skeleton";
import { UserFilters } from "@/features/users/components/filters/UserFilters";
import { DeleteUserModal } from "@/features/users/components/modals/DeleteUserModal";
import { UserFormModal } from "@/features/users/components/modals/UserFormModal";
import { UserPasswordModal } from "@/features/users/components/modals/UserPasswordModal";
import {
	copyBulkUserInfo,
	getColumns,
} from "@/features/users/components/table/columns";
import { useBulkDeleteUsers, useUsers } from "@/features/users/hooks";
import type { AdminUser } from "@/features/users/model/user-model";
import { useUserFilters } from "@/features/users/parsers/user-filters";
import { usersKeys } from "@/features/users/services/users-service";
import { useBreadcrumbs } from "@/libs/breadcrumbs";

export const Route = createFileRoute("/_authenticated/clientes")({
	component: ClientesPage,
});

function ClientesPage() {
	const queryClient = useQueryClient();
	const breadcrumbs = useBreadcrumbs();
	const {
		data: usersResponse = { data: [], total: 0 },
		isPending,
		isError,
		isFetching,
		refetch,
	} = useUsers();
	const users = usersResponse.data;
	const [filters] = useUserFilters();

	const [formModalOpen, setFormModalOpen] = useState(false);
	const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

	const [passwordModalOpen, setPasswordModalOpen] = useState(false);
	const [userForPassword, setUserForPassword] = useState<AdminUser | null>(
		null,
	);

	const bulkDeleteUsers = useBulkDeleteUsers();

	const handleCreate = useCallback(() => {
		setEditingUser(null);
		setFormModalOpen(true);
	}, []);

	const handleEdit = useCallback((user: AdminUser) => {
		setEditingUser(user);
		setFormModalOpen(true);
	}, []);

	const handleDelete = useCallback((user: AdminUser) => {
		setUserToDelete(user);
		setDeleteModalOpen(true);
	}, []);

	const handleChangePassword = useCallback((user: AdminUser) => {
		setUserForPassword(user);
		setPasswordModalOpen(true);
	}, []);

	const handleRefresh = useCallback(() => {
		queryClient.invalidateQueries({ queryKey: usersKeys.all });
	}, [queryClient]);

	const handleRetry = useCallback(() => {
		refetch();
	}, [refetch]);

	const filteredUsers = useMemo(() => {
		const role = filters.role;
		if (role === "all") return users;
		return users.filter((user) => user.role === role);
	}, [users, filters]);

	const columns = useMemo(
		() =>
			getColumns({
				onEdit: handleEdit,
				onDelete: handleDelete,
				onChangePassword: handleChangePassword,
			}),
		[handleEdit, handleDelete, handleChangePassword],
	);

	return (
		<>
			<AuthenticatedHeader breadcrumbs={breadcrumbs} />

			<div className="flex flex-1 flex-col gap-8 p-8">
				<PageHeader
					title="Clientes"
					description="Gestiona los usuarios que tienen acceso a tu tienda (administradores, vendedores y clientes)."
					actions={
						<PrimaryActionButton icon={Add01Icon} onClick={handleCreate}>
							Nuevo usuario
						</PrimaryActionButton>
					}
				/>

				{isPending ? (
					<div className="space-y-4" aria-busy="true" aria-live="polite">
						<div className="sr-only">Cargando clientes…</div>
						<TableSkeleton columnCount={6} rowCount={8} />
					</div>
				) : isError ? (
					<div className="flex flex-col items-center justify-center gap-4 rounded-md border border-destructive/50 bg-destructive/5 py-12 px-4 text-center">
						<p className="text-muted-foreground">
							No se pudieron cargar los clientes. Comprueba la conexión e
							intenta de nuevo.
						</p>
						<Button variant="outline" onClick={handleRetry}>
							Reintentar
						</Button>
					</div>
				) : (
					<DataTable
						columns={columns}
						data={filteredUsers}
						emptyMessage="No hay clientes. Añade uno para comenzar."
						emptyActionLabel="Crear primer usuario"
						onEmptyAction={handleCreate}
						filterPlaceholder="Filtrar clientes por nombre o correo…"
						defaultSorting={[{ id: "role", desc: true }]}
						filterSlot={<UserFilters />}
						onRefresh={handleRefresh}
						isRefreshing={isFetching}
						refreshAriaLabel="Actualizar lista de clientes"
						renderBulkActions={(table) => (
							<>
								<DataTableBulkCopyAction
									table={table}
									onCopy={(rows: AdminUser[]) => {
										copyBulkUserInfo(rows);
									}}
									itemName="usuarios"
									itemNameSingular="usuario"
								/>
								<DataTableBulkDeleteAction
									table={table}
									onDelete={async (rows: AdminUser[]) => {
										const ids = rows.map((user) => user.id);
										try {
											const result = await bulkDeleteUsers.mutateAsync(ids);
											if (result.errors && result.errors.length > 0) {
												const errorMessages = result.errors
													.map((e) => e.message)
													.join(". ");
												if (result.deleted > 0) {
													toast.success(
														`${result.deleted} usuario(s) eliminados.`,
													);
												}
												toast.error(
													`${result.errors.length} usuario(s) no pudieron eliminarse: ${errorMessages}`,
												);
											} else {
												toast.success(
													`${result.deleted} usuario(s) eliminados correctamente.`,
												);
											}
										} catch (error) {
											const message =
												error instanceof Error
													? error.message
													: "No se pudieron eliminar los usuarios. Vuelve a intentarlo.";
											toast.error(message);
										}
									}}
									itemName="usuarios"
									itemNameSingular="usuario"
								/>
							</>
						)}
					/>
				)}

				<UserFormModal
					open={formModalOpen}
					onOpenChange={setFormModalOpen}
					user={editingUser}
				/>

				<DeleteUserModal
					open={deleteModalOpen}
					onOpenChange={(open) => {
						setDeleteModalOpen(open);
						if (!open) setUserToDelete(null);
					}}
					user={userToDelete}
				/>

				<UserPasswordModal
					open={passwordModalOpen}
					onOpenChange={(open) => {
						setPasswordModalOpen(open);
						if (!open) setUserForPassword(null);
					}}
					user={userForPassword}
				/>
			</div>
		</>
	);
}
