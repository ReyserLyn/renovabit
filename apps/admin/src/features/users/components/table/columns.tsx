import {
	Copy01Icon,
	Delete04Icon,
	Edit02Icon,
	ResetPasswordIcon,
	ShoppingCartCheck02FreeIcons,
	TimeScheduleIcon,
	UserBlock01Icon,
	UserMultiple02FreeIcons,
	UserShield01Icon,
	UserUnlock01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@renovabit/ui/components/ui/badge";
import { Button } from "@renovabit/ui/components/ui/button";
import { Checkbox } from "@renovabit/ui/components/ui/checkbox";
import { cn } from "@renovabit/ui/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { ColumnHeader } from "@/components/table/column-header";
import { formatDate } from "@/libs/utils";
import type { User } from "../../model/user-model";
import {
	getRoleLabel,
	getUserDisplayName,
	roleWeight,
	USER_ROLE_VALUES,
} from "../../model/user-model";

export type UserColumnHandlers = {
	onEdit: (user: User) => void;
	onDelete: (user: User) => void;
	onChangePassword: (user: User) => void;
	onBan: (user: User) => void;
	onUnban: (user: User) => void;
	onViewSessions: (user: User) => void;
};

const roleConfig: Record<
	User["role"],
	{
		icon:
			| typeof UserShield01Icon
			| typeof ShoppingCartCheck02FreeIcons
			| typeof UserMultiple02FreeIcons;
		bgColor: string;
		textColor: string;
		borderColor: string;
	}
> = {
	admin: {
		icon: UserShield01Icon,
		bgColor: "bg-purple-50 dark:bg-purple-950/20",
		textColor: "text-purple-700 dark:text-purple-300",
		borderColor: "border-purple-200 dark:border-purple-800",
	},
	distributor: {
		icon: ShoppingCartCheck02FreeIcons,
		bgColor: "bg-blue-50 dark:bg-blue-950/20",
		textColor: "text-blue-700 dark:text-blue-300",
		borderColor: "border-blue-200 dark:border-blue-800",
	},
	customer: {
		icon: UserMultiple02FreeIcons,
		bgColor: "bg-green-50 dark:bg-green-950/20",
		textColor: "text-green-700 dark:text-green-300",
		borderColor: "border-green-200 dark:border-green-800",
	},
};

function copyUserInfo(user: User) {
	const usuario = user.displayUsername?.trim() || "—";
	const info = [
		`Nombre: ${user.name?.trim() || "—"}`,
		`Email: ${user.email}`,
		`Usuario: ${usuario}`,
		user.phone ? `Teléfono: ${user.phone}` : null,
		`Rol: ${getRoleLabel(user.role)}`,
		`Fecha de registro: ${formatDate(user.createdAt)}`,
	]
		.filter(Boolean)
		.join("\n");

	navigator.clipboard.writeText(info).then(
		() => {
			toast.success("Información del usuario copiada al portapapeles");
		},
		() => {
			toast.error("No se pudo copiar la información");
		},
	);
}

export function copyBulkUserInfo(users: User[]) {
	if (users.length === 0) return;

	const combinedInfo = users
		.map((user, index) => {
			const usuario = user.displayUsername?.trim() || "—";
			const parts: string[] = [`--- Usuario ${index + 1} ---`];
			parts.push(`Nombre: ${user.name?.trim() || "—"}`);
			parts.push(`Email: ${user.email}`);
			parts.push(`Usuario: ${usuario}`);
			if (user.phone) parts.push(`Teléfono: ${user.phone}`);
			parts.push(`Rol: ${getRoleLabel(user.role)}`);
			parts.push(`Fecha de registro: ${formatDate(user.createdAt)}`);
			return parts.join("\n");
		})
		.join("\n\n");

	navigator.clipboard.writeText(combinedInfo).then(
		() => {
			toast.success(
				`Información de ${users.length} usuario(s) copiada al portapapeles`,
			);
		},
		() => {
			toast.error("No se pudo copiar la información");
		},
	);
}

export function getColumns(handlers: UserColumnHandlers): ColumnDef<User>[] {
	return [
		{
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						table.getIsSomePageRowsSelected()
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Seleccionar todas las filas"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Seleccionar fila"
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			id: "name",
			accessorFn: (user) =>
				`${user.name?.trim() ?? ""} ${user.email ?? ""}`.trim(),
			header: ({ column }) => (
				<ColumnHeader
					column={column}
					title="Nombre"
					className="min-w-[220px]"
				/>
			),
			cell: ({ row }) => {
				const user = row.original;
				const name = user.name?.trim() || "—";

				return (
					<div className="flex flex-col gap-0.5">
						<span className="font-medium text-foreground">{name}</span>
						<span className="text-xs text-muted-foreground">{user.email}</span>
					</div>
				);
			},
		},
		{
			id: "identity",
			header: ({ column }) => (
				<ColumnHeader
					column={column}
					title="Usuario"
					className="min-w-[200px]"
				/>
			),
			cell: ({ row }) => {
				const user = row.original;
				const display = user.displayUsername?.trim() || "—";
				const loginHandle = user.username ? `@${user.username}` : "—";
				const isBanned =
					user.banned &&
					(!user.banExpires || new Date(user.banExpires) > new Date());

				return (
					<div className="flex flex-col gap-0.5">
						<div className="flex items-center gap-2">
							<span className="font-medium text-foreground">{display}</span>
							{isBanned && (
								<Badge
									variant="destructive"
									className="h-5 px-1.5 text-[10px] uppercase tracking-wider"
								>
									<HugeiconsIcon
										icon={UserBlock01Icon}
										className="mr-1 size-3"
									/>
									Baneado
								</Badge>
							)}
						</div>
						<span className="text-xs text-muted-foreground">{loginHandle}</span>
					</div>
				);
			},
		},
		{
			accessorKey: "role",
			header: ({ column }) => (
				<ColumnHeader column={column} title="Rol" className="min-w-[140px]" />
			),
			cell: ({ row }) => {
				const user = row.original;
				const label = getRoleLabel(user.role);
				const config = roleConfig[user.role];

				return (
					<div
						className={cn(
							"inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
							config.bgColor,
							config.textColor,
							config.borderColor,
						)}
					>
						<HugeiconsIcon icon={config.icon} className="size-3.5" />
						<span>{label}</span>
					</div>
				);
			},
			sortingFn: (rowA, rowB, columnId) => {
				const rawA = rowA.getValue(columnId);
				const rawB = rowB.getValue(columnId);
				const a = USER_ROLE_VALUES.find((r) => r === rawA) ?? "customer";
				const b = USER_ROLE_VALUES.find((r) => r === rawB) ?? "customer";
				return roleWeight[a] - roleWeight[b];
			},
		},
		{
			accessorKey: "phone",
			header: ({ column }) => (
				<ColumnHeader
					column={column}
					title="Teléfono"
					className="min-w-[140px]"
				/>
			),
			cell: ({ row }) => {
				const phone = row.original.phone;
				return (
					<span className="text-sm text-muted-foreground">
						{phone && phone.trim().length > 0 ? phone : "—"}
					</span>
				);
			},
		},
		{
			accessorKey: "createdAt",
			header: ({ column }) => (
				<ColumnHeader
					column={column}
					title="Fecha de registro"
					className="min-w-[140px]"
				/>
			),
			cell: ({ row }) => (
				<span className="text-sm text-muted-foreground">
					{formatDate(row.original.createdAt)}
				</span>
			),
		},
		{
			id: "actions",
			header: "Acciones",
			cell: ({ row }) => {
				const user = row.original;
				const {
					onEdit,
					onDelete,
					onChangePassword,
					onBan,
					onUnban,
					onViewSessions,
				} = handlers;

				const isBanned =
					user.banned &&
					(!user.banExpires || new Date(user.banExpires) > new Date());

				return (
					<div className="flex gap-1.5">
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="size-8"
							onClick={() => copyUserInfo(user)}
							aria-label={`Copiar información de ${getUserDisplayName(user)}`}
							title="Copiar información del usuario"
						>
							<HugeiconsIcon icon={Copy01Icon} className="size-4" />
						</Button>

						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="size-8"
							onClick={() => onViewSessions(user)}
							aria-label={`Ver sesiones de ${getUserDisplayName(user)}`}
							title="Ver sesiones activas"
						>
							<HugeiconsIcon icon={TimeScheduleIcon} className="size-4" />
						</Button>

						{isBanned ? (
							<Button
								type="button"
								variant="outline"
								size="icon"
								className="size-8 border-destructive/20 text-destructive hover:bg-destructive/10"
								onClick={() => onUnban(user)}
								aria-label={`Desbanear usuario ${getUserDisplayName(user)}`}
								title="Desbanear usuario"
							>
								<HugeiconsIcon icon={UserUnlock01Icon} className="size-4" />
							</Button>
						) : (
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="size-8 text-orange-600 dark:text-orange-400"
								onClick={() => onBan(user)}
								aria-label={`Banear usuario ${getUserDisplayName(user)}`}
								title="Banear usuario"
							>
								<HugeiconsIcon icon={UserBlock01Icon} className="size-4" />
							</Button>
						)}

						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="size-8"
							onClick={() => onChangePassword(user)}
							aria-label={`Cambiar contraseña de ${getUserDisplayName(user)}`}
							title="Cambiar contraseña"
						>
							<HugeiconsIcon icon={ResetPasswordIcon} className="size-4" />
						</Button>

						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="size-8"
							onClick={() => onEdit(user)}
							aria-label={`Editar usuario ${getUserDisplayName(user)}`}
							title="Editar usuario"
						>
							<HugeiconsIcon icon={Edit02Icon} className="size-4" />
						</Button>

						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="size-8 text-destructive"
							onClick={() => onDelete(user)}
							aria-label={`Eliminar usuario ${getUserDisplayName(user)}`}
							title="Eliminar usuario"
						>
							<HugeiconsIcon icon={Delete04Icon} className="size-4" />
						</Button>
					</div>
				);
			},
			enableSorting: false,
		},
	];
}
