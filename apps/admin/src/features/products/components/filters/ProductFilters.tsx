import { Button } from "@renovabit/ui/components/ui/button";
import { Checkbox } from "@renovabit/ui/components/ui/checkbox";
import { Label } from "@renovabit/ui/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@renovabit/ui/components/ui/select";
import { useBrands } from "@/features/brands/hooks";
import { useCategories } from "@/features/categories/hooks";
import { useProductFilters } from "../../parsers/product-filters";

type CategoryItem = { id: string; name: string; slug: string };
type BrandItem = { id: string; name: string; slug: string };

export function ProductFilters() {
	const [filters, setFilters] = useProductFilters();
	const { data: categoriesRaw = [] } = useCategories(true);
	const { data: brandsRaw = [] } = useBrands(true);

	const categories = (
		Array.isArray(categoriesRaw) ? categoriesRaw : []
	) as CategoryItem[];
	const brands = (Array.isArray(brandsRaw) ? brandsRaw : []) as BrandItem[];

	const handleCategoryChange = (value: string | null) => {
		setFilters((prev) => ({
			...prev,
			category: value === "all" || value == null ? "" : value,
			page: 0,
		}));
	};

	const handleBrandChange = (value: string | null) => {
		setFilters((prev) => ({
			...prev,
			brand: value === "all" || value == null ? "" : value,
			page: 0,
		}));
	};

	const handleIncludeInactiveChange = (checked: boolean) => {
		setFilters((prev) => ({ ...prev, includeInactive: checked, page: 0 }));
	};

	const hasActiveFilters =
		!!filters.category || !!filters.brand || !filters.includeInactive;

	const clearFilters = () => {
		setFilters({
			category: "",
			brand: "",
			includeInactive: true,
			page: 0,
		});
	};

	const selectedCategory = filters.category
		? categories.find((c) => c.slug === filters.category)
		: null;
	const selectedBrand = filters.brand
		? brands.find((b) => b.slug === filters.brand)
		: null;

	return (
		<div className="flex flex-wrap items-center gap-4">
			<div className="flex items-center gap-2">
				<Label htmlFor="filter-category" className="text-sm whitespace-nowrap">
					Categoría
				</Label>
				<Select
					value={filters.category || "all"}
					onValueChange={handleCategoryChange}
				>
					<SelectTrigger id="filter-category" className="w-[180px]">
						<SelectValue placeholder="Todas">
							{selectedCategory ? selectedCategory.name : "Todas"}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Todas</SelectItem>
						{categories.map((c) => (
							<SelectItem key={c.id} value={c.slug}>
								{c.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex items-center gap-2">
				<Label htmlFor="filter-brand" className="text-sm whitespace-nowrap">
					Marca
				</Label>
				<Select
					value={filters.brand || "all"}
					onValueChange={handleBrandChange}
				>
					<SelectTrigger id="filter-brand" className="w-[180px]">
						<SelectValue placeholder="Todas">
							{selectedBrand ? selectedBrand.name : "Todas"}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Todas</SelectItem>
						{brands.map((b) => (
							<SelectItem key={b.id} value={b.slug}>
								{b.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex items-center gap-2">
				<Checkbox
					id="filter-include-inactive"
					checked={filters.includeInactive}
					onCheckedChange={(c) => handleIncludeInactiveChange(!!c)}
				/>
				<Label
					htmlFor="filter-include-inactive"
					className="text-sm font-normal cursor-pointer"
				>
					Incluir inactivos
				</Label>
			</div>

			{hasActiveFilters ? (
				<Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
					Limpiar filtros
				</Button>
			) : null}
		</div>
	);
}
