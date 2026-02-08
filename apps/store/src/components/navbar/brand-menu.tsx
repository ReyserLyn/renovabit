import {
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuTrigger,
} from "@renovabit/ui/components/ui/navigation-menu";
import { fetchBrands } from "@/features/brands/lib/api/brands";
import { ListItem } from "./list-item";

export async function BrandMenu() {
	const brands = await fetchBrands();

	return (
		<NavigationMenuItem>
			<NavigationMenuTrigger>Marcas</NavigationMenuTrigger>

			<NavigationMenuContent className="p-8">
				<h6 className="px-2 font-semibold text-muted-foreground text-sm uppercase">
					Marcas
				</h6>
				<ul className="mt-2.5 grid w-[200px] gap-3 px-2 md:w-[500px] md:grid-cols-3 lg:w-[600px]">
					{brands.length > 0 ? (
						brands.map((brand) => (
							<ListItem
								href={`/marca/${brand.slug}`}
								key={brand.id}
								title={brand.name}
							/>
						))
					) : (
						<EmptyBrands />
					)}
				</ul>
			</NavigationMenuContent>
		</NavigationMenuItem>
	);
}

function EmptyBrands() {
	return (
		<li className="col-span-full text-muted-foreground text-sm">
			No hay marcas disponibles
		</li>
	);
}
