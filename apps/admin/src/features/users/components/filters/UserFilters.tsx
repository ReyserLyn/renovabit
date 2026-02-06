import { Button } from "@renovabit/ui/components/ui/button";
import { Label } from "@renovabit/ui/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@renovabit/ui/components/ui/select";
import type { UserRoleFilter } from "../../parsers/user-filters";
import { useUserFilters } from "../../parsers/user-filters";

function getRoleFilterLabel(role: UserRoleFilter): string {
	switch (role) {
		case "admin":
			return "Administradores";
		case "distributor":
			return "Distribuidores";
		case "customer":
			return "Clientes";
		case "all":
		default:
			return "Todos los roles";
	}
}

export function UserFilters() {
	const [filters, setFilters] = useUserFilters();

	const handleRoleChange = (value: string | null) => {
		const nextRole = (value ?? "all") as UserRoleFilter;
		setFilters({
			role: nextRole,
		});
	};

	const clearFilters = () => {
		setFilters({
			role: "all",
		});
	};

	const hasActiveFilters = filters.role !== "all";

	return (
		<div className="flex flex-wrap items-center gap-4">
			<div className="flex items-center gap-2">
				<Label htmlFor="filter-role" className="text-sm whitespace-nowrap">
					Rol
				</Label>
				<Select value={filters.role} onValueChange={handleRoleChange}>
					<SelectTrigger id="filter-role" className="w-[200px]">
						<SelectValue placeholder="Todos los roles">
							{getRoleFilterLabel(filters.role)}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Todos los roles</SelectItem>
						<SelectItem value="admin">Administradores</SelectItem>
						<SelectItem value="distributor">Distribuidores</SelectItem>
						<SelectItem value="customer">Clientes</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{hasActiveFilters ? (
				<Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
					Limpiar filtros
				</Button>
			) : null}
		</div>
	);
}
