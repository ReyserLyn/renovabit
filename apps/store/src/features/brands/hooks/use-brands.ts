"use client";

import { useQuery } from "@tanstack/react-query";
import { brandsQueryOptions } from "../lib/api/brands";

export function useBrands() {
	return useQuery(brandsQueryOptions);
}
