import { Button } from "@renovabit/ui/components/ui/button";
import { Label } from "@renovabit/ui/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@renovabit/ui/components/ui/select";
import { ROLE_FILTER_LABELS, USER_ROLE_VALUES } from "../../model/user-model";
import {
	USER_ROLE_FILTER_OPTIONS,
	type UserRoleFilter,
	useUserFilters,
} from "../../parsers/user-filters";

function isUserRoleFilter(val: string): val is UserRoleFilter {
	return USER_ROLE_FILTER_OPTIONS.some((r) => r === val);
}

function getRoleFilterLabel(role: UserRoleFilter): string {
	if (role === "all") return "Todos los roles";
	return ROLE_FILTER_LABELS[role];
}

export function UserFilters() {
	const [filters, setFilters] = useUserFilters();

	const handleRoleChange = (value: string | null) => {
		const raw = value ?? "all";
		const nextRole: UserRoleFilter = isUserRoleFilter(raw) ? raw : "all";
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
							{getRoleFilterLabel(
								isUserRoleFilter(filters.role) ? filters.role : "all",
							)}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Todos los roles</SelectItem>
						{USER_ROLE_VALUES.map((role) => (
							<SelectItem key={role} value={role}>
								{ROLE_FILTER_LABELS[role]}
							</SelectItem>
						))}
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
