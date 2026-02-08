import { LogoHorizontalLight } from "@renovabit/ui/components/branding/logo-horizontal-light";
import {
	NavigationMenu,
	NavigationMenuList,
} from "@renovabit/ui/components/ui/navigation-menu";

import Link from "next/link";
import { ActionButtons } from "./action-buttons";
import { AuthButtons } from "./auth-buttons";
import { BrandMenu } from "./brand-menu";
import CartButton from "./cart-button";
import { CategoryMenu } from "./category-menu";
import { InfoMenu } from "./info-menu";
import InputSearch from "./input-search";

export default async function Navbar() {
	return (
		<nav className="flex w-full flex-col items-center gap-4 py-4">
			<div className="flex w-full items-center justify-between">
				{/* <SidebarToggle /> 		 */}

				<Link href="/">
					<LogoHorizontalLight className="w-[170px] md:w-[200px]" />
				</Link>

				<InputSearch className="hidden w-full max-w-xl md:block" />

				<div className="flex items-center gap-4">
					<CartButton />

					<AuthButtons />
				</div>
			</div>

			<div className="flex w-full items-center justify-between gap-4">
				<InputSearch className="block w-full max-w-xl md:hidden" />

				<NavigationMenu className="hidden md:flex">
					<NavigationMenuList className="gap-1">
						<CategoryMenu />

						<BrandMenu />

						<InfoMenu />
					</NavigationMenuList>
				</NavigationMenu>

				<ActionButtons />
			</div>
		</nav>
	);
}
