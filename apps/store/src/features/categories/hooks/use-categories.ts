"use client";

import { useQuery } from "@tanstack/react-query";
import {
	categoriesNavbarQueryOptions,
	categoriesQueryOptions,
} from "../lib/api/categories";

export function useCategories() {
	return useQuery(categoriesQueryOptions);
}

export function useCategoriesNavbar() {
	return useQuery(categoriesNavbarQueryOptions);
}
