import { parseAsString, useQueryStates } from "nuqs";

export const userFiltersParsers = {
	role: parseAsString.withDefault("all"),
} as const;

export type UserRoleFilter = "all" | "admin" | "distributor" | "customer";

export type UserFiltersState = {
	role: UserRoleFilter;
};

export function useUserFilters() {
	return useQueryStates(userFiltersParsers, {
		history: "push",
		shallow: false,
	}) as [UserFiltersState, (next: UserFiltersState) => void];
}
