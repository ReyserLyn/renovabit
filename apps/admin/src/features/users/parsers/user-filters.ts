import { parseAsString, useQueryStates } from "nuqs";
import { USER_ROLE_VALUES } from "../model/user-model";

export const USER_ROLE_FILTER_OPTIONS = ["all", ...USER_ROLE_VALUES] as const;
export type UserRoleFilter = (typeof USER_ROLE_FILTER_OPTIONS)[number];

export const userFiltersParsers = {
	role: parseAsString.withDefault("all"),
} as const;

export type UserFiltersState = {
	role: UserRoleFilter;
};

export function useUserFilters() {
	return useQueryStates(userFiltersParsers, {
		history: "push",
		shallow: false,
	});
}
