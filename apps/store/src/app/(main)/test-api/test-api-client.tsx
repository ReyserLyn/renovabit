"use client";

import { useBrands, useCategories, useCategoriesNavbar } from "@/features";

export function TestApiClient() {
	const brandsQuery = useBrands();
	const categoriesQuery = useCategories();
	const categoriesNavbarQuery = useCategoriesNavbar();

	return (
		<div className="space-y-6">
			<section>
				<h2 className="text-2xl font-semibold mb-4">Brands</h2>
				{brandsQuery.isPending && <p>Cargando brands...</p>}
				{brandsQuery.error && (
					<p className="text-red-500">
						Error:{" "}
						{brandsQuery.error instanceof Error
							? brandsQuery.error.message
							: "Unknown error"}
					</p>
				)}
				{brandsQuery.data && (
					<div>
						<p className="text-green-600">
							✓ Brands cargados: {brandsQuery.data.length} marcas
						</p>
						<pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto max-h-96">
							{JSON.stringify(brandsQuery.data, null, 2)}
						</pre>
					</div>
				)}
			</section>

			<section>
				<h2 className="text-2xl font-semibold mb-4">Categories</h2>
				{categoriesQuery.isPending && <p>Cargando categories...</p>}
				{categoriesQuery.error && (
					<p className="text-red-500">
						Error:{" "}
						{categoriesQuery.error instanceof Error
							? categoriesQuery.error.message
							: "Unknown error"}
					</p>
				)}
				{categoriesQuery.data && (
					<div>
						<p className="text-green-600">
							✓ Categories cargadas: {categoriesQuery.data.length} categorías
						</p>
						<pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto max-h-96">
							{JSON.stringify(categoriesQuery.data, null, 2)}
						</pre>
					</div>
				)}
			</section>

			<section>
				<h2 className="text-2xl font-semibold mb-4">Categories Navbar</h2>
				{categoriesNavbarQuery.isPending && (
					<p>Cargando categories navbar...</p>
				)}
				{categoriesNavbarQuery.error && (
					<p className="text-red-500">
						Error:{" "}
						{categoriesNavbarQuery.error instanceof Error
							? categoriesNavbarQuery.error.message
							: "Unknown error"}
					</p>
				)}
				{categoriesNavbarQuery.data && (
					<div>
						<p className="text-green-600">
							✓ Categories navbar cargadas:{" "}
							{Array.isArray(categoriesNavbarQuery.data)
								? categoriesNavbarQuery.data.length
								: "N/A"}
						</p>
						<pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto max-h-96">
							{JSON.stringify(categoriesNavbarQuery.data, null, 2)}
						</pre>
					</div>
				)}
			</section>
		</div>
	);
}
